import { IAuthRepository } from '../i-repositories/auth'
import { Credential, PasswordResetInput, RegisterInput } from '../types'
import { AuthTypes } from '@stranerd/api-commons'
import { UserToModel } from '../../data/models/users'

export class AuthUseCase {
	private repository: IAuthRepository

	constructor (repository: IAuthRepository) {
		this.repository = repository
	}

	async authenticateUser (params: Credential) {
		return await this.repository.authenticateUser(params, true, AuthTypes.email)
	}

	async googleSignIn (input: { idToken: string, referrer: string }) {
		return await this.repository.googleSignIn(input.idToken, input.referrer)
	}

	async registerUser (params: RegisterInput) {
		const userModel: UserToModel = {
			...params,
			isVerified: false,
			authTypes: [AuthTypes.email]
		}

		return await this.repository.addNewUser(userModel, AuthTypes.email)
	}

	async resetPassword (input: PasswordResetInput) {
		return await this.repository.resetPassword(input)
	}

	async sendPasswordResetMail (input: { email: string, redirectUrl: string }) {
		return await this.repository.sendPasswordResetMail(input.email, input.redirectUrl)
	}

	async sendVerificationMail (input: { email: string, redirectUrl: string }) {
		return await this.repository.sendVerificationMail(input.email, input.redirectUrl)
	}

	async verifyEmail (token: string) {
		return await this.repository.verifyEmail(token)
	}
}