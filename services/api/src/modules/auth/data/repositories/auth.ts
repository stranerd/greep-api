import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import {
	AuthTypes,
	BadRequestError,
	EmailsList,
	Enum,
	Hash,
	MediaOutput,
	Random,
	ValidationError,
	readEmailFromPug,
	signinWithApple,
	signinWithGoogle,
} from 'equipped'
import { IAuthRepository } from '../../domain/i-repositories/auth'
import { Credential, PasswordResetInput } from '../../domain/types'
import { UserMapper } from '../mappers/users'
import { UserFromModel, UserToModel } from '../models/users'
import User from '../mongooseModels/users'

const TOKENS_TTL_IN_SECS = 60 * 60

export class AuthRepository implements IAuthRepository {
	private static instance: AuthRepository
	private mapper = new UserMapper()

	static getInstance() {
		if (!AuthRepository.instance) AuthRepository.instance = new AuthRepository()
		return AuthRepository.instance
	}

	async addNewUser(data: UserToModel, type: Enum<typeof AuthTypes>) {
		data.email = data.email.toLowerCase()
		if (data.password) data.password = await Hash.hash(data.password)
		const userData = await new User(data).save()
		return this.signInUser(userData, type)
	}

	async authenticateUser(details: Credential, passwordValidate: boolean, type: Enum<typeof AuthTypes>) {
		details.email = details.email.toLowerCase()
		const user = await User.findOne({ $or: [{ email: details.email }, { username: details.email }] })
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email/username exists'] }])

		const match = passwordValidate
			? user.authTypes.includes(AuthTypes.email)
				? await Hash.compare(details.password, user.password)
				: false
			: true

		if (!match) throw new ValidationError([{ field: 'password', messages: ['Invalid password'] }])

		return this.signInUser(user, type)
	}

	async sendVerificationMail(email: string) {
		email = email.toLowerCase()
		const token = Random.number(1e5, 1e6).toString()

		// save to cache
		await appInstance.cache.set('email-verification-token-' + token, email, TOKENS_TTL_IN_SECS)

		// send verification mail
		const emailContent = await readEmailFromPug('emails/sendOTP.pug', { token })
		await publishers.SENDMAIL.publish({
			to: email,
			subject: 'Verify Your Email',
			from: EmailsList.NO_REPLY,
			content: emailContent,
			data: {},
		})

		return true
	}

	async verifyEmail(token: string) {
		// check token in cache
		const userEmail = await appInstance.cache.get('email-verification-token-' + token)
		if (!userEmail) throw new BadRequestError('Invalid token')
		await appInstance.cache.delete('email-verification-token-' + token)

		const user = await User.findOneAndUpdate({ email: userEmail }, { $set: { isVerified: true } }, { new: true })
		if (!user) throw new BadRequestError('No account with saved email exists')

		return this.mapper.mapFrom(user)!
	}

	async sendPasswordResetMail(email: string) {
		email = email.toLowerCase()
		const token = Random.number(1e5, 1e6).toString()

		// save to cache
		await appInstance.cache.set('password-reset-token-' + token, email, TOKENS_TTL_IN_SECS)

		// send reset password mail
		const emailContent = await readEmailFromPug('emails/sendOTP.pug', { token })
		await publishers.SENDMAIL.publish({
			to: email,
			subject: 'Reset Your Password',
			from: EmailsList.NO_REPLY,
			content: emailContent,
			data: {},
		})

		return true
	}

	async resetPassword(input: PasswordResetInput) {
		// check token in cache
		const userEmail = await appInstance.cache.get('password-reset-token-' + input.token)
		if (!userEmail) throw new BadRequestError('Invalid token')
		await appInstance.cache.delete('password-reset-token-' + input.token)

		const user = await User.findOneAndUpdate(
			{ email: userEmail },
			{
				$set: { password: await Hash.hash(input.password) },
				$addToSet: { authTypes: AuthTypes.email },
			},
			{ new: true },
		)
		if (!user) throw new BadRequestError('No account with saved email exists')

		return this.mapper.mapFrom(user)!
	}

	async googleSignIn(idToken: string, referrer: string | null) {
		const data = await signinWithGoogle(idToken)
		const email = data.email!.toLowerCase()

		const photo = data.picture ? ({ link: data.picture, type: 'image/png' } as unknown as MediaOutput) : null

		return this.authorizeSocial(AuthTypes.google, {
			email,
			photo,
			name: { first: data.first_name, last: data.last_name },
			isVerified: data.email_verified === 'true',
			referrer,
		})
	}

	async appleSignIn({ idToken, firstName, lastName }, referrer) {
		const data = await signinWithApple(idToken).catch((e: any) => {
			throw new BadRequestError(e.message)
		})
		const email = data.email?.toLowerCase()
		if (!email) throw new BadRequestError('cant access your email. Signin another way')

		return this.authorizeSocial(AuthTypes.apple, {
			email,
			photo: null,
			name: { first: firstName ?? 'Apple User', last: lastName ?? '' },
			isVerified: data.email_verified === 'true',
			referrer,
		})
	}

	private async authorizeSocial(
		type: Enum<typeof AuthTypes>,
		data: Pick<UserToModel, 'email' | 'name' | 'photo' | 'isVerified' | 'referrer'>,
	) {
		const userData = await User.findOne({ email: data.email })

		if (!userData)
			return await this.addNewUser(
				{
					name: data.name,
					username: Random.string(9),
					email: data.email,
					photo: data.photo,
					phone: null,
					authTypes: [type],
					password: '',
					isVerified: data.isVerified,
					referrer: data.referrer,
				},
				type,
			)

		return await this.authenticateUser(
			{
				email: userData.email,
				password: '',
			},
			false,
			type,
		)
	}

	private async signInUser(user: UserFromModel, type: Enum<typeof AuthTypes>) {
		const userUpdated = await User.findByIdAndUpdate(
			user._id,
			{
				$set: { lastSignedInAt: Date.now(), ...(user.username ? {} : { username: Random.string(9) }) },
				$addToSet: { authTypes: [type] },
			},
			{ new: true },
		)

		return this.mapper.mapFrom(userUpdated)!
	}
}
