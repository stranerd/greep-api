import { IAuthRepository } from '../../domain/i-repositories/auth'
import { Credential, PasswordResetInput } from '../../domain/types'
import { OAuth2Client } from 'google-auth-library'
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

	async googleSignIn (tokenId: string, clientId: string, referrer: string | null) {
		const client = new OAuth2Client(clientId)

		const ticket = await client.verifyIdToken({
			idToken: tokenId,
			audience: clientId
		}).catch(() => null)
		if (!ticket) throw new BadRequestError('Invalid token')

		const user = ticket.getPayload()
		if (!user) throw new BadRequestError('Invalid token')

		const [firstName = '', lastName = ''] = (user.name ?? '').split(' ')
		const email = user.email!.toLowerCase()

		const userPhoto = user.picture ? {
			link: user.picture
		} as unknown as MediaOutput : null

		const userData = await User.findOne({ email })

		if (!userData) {
			const userData = {
				email, referrer,
				authTypes: [AuthTypes.google],
				firstName,
				lastName,
				description: '',
				isVerified: true,
				roles: {},
				password: '',
				photo: userPhoto,
				coverPhoto: null
			}
			return await this.addNewUser(userData, AuthTypes.google)
		}

		const credentials: Credential = {
			email: userData.email,
			password: ''
		}
		return await this.authenticateUser(credentials, false, AuthTypes.google)
	}

	private async signInUser (user: UserFromModel & mongoose.Document<any, any, UserFromModel>, type: AuthTypes) {
		const userUpdated = await User.findByIdAndUpdate(user._id, {
			$set: { lastSignedInAt: Date.now() },
			$addToSet: { authTypes: [type] }
		}, { new: true })

		return this.mapper.mapFrom(userUpdated)!
	}
}