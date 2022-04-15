import { IAuthRepository } from '../../domain/i-repositories/auth'
import { Credential, PasswordResetInput } from '../../domain/types'
import User from '../mongooseModels/users'
import { UserFromModel, UserToModel } from '../models/users'
import { hash, hashCompare } from '@utils/hash'
import {
	AuthTypes,
	BadRequestError,
	getRandomValue,
	MediaOutput,
	mongoose,
	readEmailFromPug,
	ValidationError
} from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'
import { UserMapper } from '../mappers/users'
import { EmailsList } from '@utils/types/email'
import { EventTypes, publishers } from '@utils/events'
import axios from 'axios'

const TOKENS_TTL_IN_SECS = 60 * 60

export class AuthRepository implements IAuthRepository {

	private static instance: AuthRepository
	private mapper = new UserMapper()

	private constructor () {
		this.mapper = new UserMapper()
	}

	static getInstance () {
		if (!AuthRepository.instance) AuthRepository.instance = new AuthRepository()
		return AuthRepository.instance
	}

	async addNewUser (data: UserToModel, type: AuthTypes) {
		data.email = data.email.toLowerCase()
		if (data.password) data.password = await hash(data.password)
		const userData = await new User(data).save()
		return this.signInUser(userData, type)
	}

	async authenticateUser (details: Credential, passwordValidate: boolean, type: AuthTypes) {
		details.email = details.email.toLowerCase()
		const user = await User.findOne({ email: details.email })
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		const match = passwordValidate
			? user.authTypes.includes(AuthTypes.email)
				? await hashCompare(details.password, user.password)
				: false
			: true

		if (!match) throw new ValidationError([{ field: 'password', messages: ['Invalid password'] }])

		return this.signInUser(user, type)
	}

	async sendVerificationMail (email: string, redirectUrl: string) {
		const user = await User.findOne({ email: email.toLowerCase() })
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		const token = getRandomValue(40)

		// save to cache
		await appInstance.cache.set('verification-token-' + token, user.email, TOKENS_TTL_IN_SECS)

		// send verification mail
		const url = `${redirectUrl}?token=${token}`
		const emailContent = await readEmailFromPug('emails/email-verification.pug', { redirectUrl: url })

		await publishers[EventTypes.SENDMAIL].publish({
			to: email,
			subject: 'Verify Your Email',
			from: EmailsList.NO_REPLY,
			content: emailContent,
			data: {}
		})

		return true
	}

	async verifyEmail (token: string) {
		// check token in cache
		const userEmail = await appInstance.cache.get('verification-token-' + token)
		if (!userEmail) throw new BadRequestError('Invalid token')

		const user = await User.findOneAndUpdate({ email: userEmail }, { $set: { isVerified: true } }, { new: true })
		if (!user) throw new BadRequestError('No account with saved email exists')

		return this.mapper.mapFrom(user)!
	}

	async sendPasswordResetMail (email: string, redirectUrl: string) {
		const user = await User.findOne({ email: email.toLowerCase() })
		if (!user) throw new ValidationError([{ field: 'email', messages: ['No account with such email exists'] }])

		const token = getRandomValue(40)

		// save to cache
		await appInstance.cache.set('password-reset-token-' + token, user.email, TOKENS_TTL_IN_SECS)

		// send reset password mail
		const url = `${redirectUrl}?token=${token}`
		const emailContent = await readEmailFromPug('emails/password-reset.pug', { redirectUrl: url })

		await publishers[EventTypes.SENDMAIL].publish({
			to: email,
			subject: 'Reset Your Password',
			from: EmailsList.NO_REPLY,
			content: emailContent,
			data: {}
		})

		return true
	}

	async resetPassword (input: PasswordResetInput) {
		// check token in cache
		const userEmail = await appInstance.cache.get('password-reset-token-' + input.token)
		if (!userEmail) throw new BadRequestError('Invalid token')

		const user = await User.findOneAndUpdate({ email: userEmail }, { $set: { password: await hash(input.password) } }, { new: true })
		if (!user) throw new BadRequestError('No account with saved email exists')

		return this.mapper.mapFrom(user)!
	}

	async googleSignIn (idToken: string, referrer: string | null) {
		const authUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
		const { data } = await axios.get(authUrl).catch((err) => {
			const message = err?.response?.data?.error?.message
			throw new BadRequestError(message ? 'Invalid id token' : 'Something unexpected happened')
		})

		const names = (data.name ?? '').split(' ')
		const first = names[0] ?? ''
		const middle = (names.length > 2 ? names[1] : '') ?? ''
		const last = (names.length > 1 ? names.reverse()[0] : '') ?? ''
		const email = data.email!.toLowerCase()
		const photo = data.picture ? {
			link: data.picture
		} as unknown as MediaOutput : null

		return this.authorizeSocial(AuthTypes.google, {
			email, photo, name: { first, middle, last }, referrer
		})
	}

	private async authorizeSocial (type: AuthTypes, data: Pick<UserToModel, 'email' | 'name' | 'photo' | 'referrer'>) {
		const userData = await User.findOne({ email: data.email })

		if (!userData) return await this.addNewUser({
			name: data.name,
			email: data.email,
			photo: data.photo,
			referrer: data.referrer,
			authTypes: [type],
			description: '',
			password: '',
			coverPhoto: null,
			isVerified: true
		}, type)

		return await this.authenticateUser({
			email: userData.email,
			password: ''
		}, false, type)
	}

	private async signInUser (user: UserFromModel & mongoose.Document<any, any, UserFromModel>, type: AuthTypes) {
		const userUpdated = await User.findByIdAndUpdate(user._id, {
			$set: { lastSignedInAt: Date.now() },
			$addToSet: { authTypes: [type] }
		}, { new: true })

		return this.mapper.mapFrom(userUpdated)!
	}
}