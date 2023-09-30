import { AuthTypes } from 'equipped'
import { UserToModel } from '../../data/models/users'
import { IAuthRepository } from '../i-repositories/auth'
import { Credential, PasswordResetInput, RegisterInput } from '../types'

export class AuthUseCase {
	private repository: IAuthRepository

	constructor (repository: IAuthRepository) {
		this.repository = repository
	}

	async authenticateUser(params: Credential) {
		return await this.repository.authenticateUser(params, true, AuthTypes.email)
	}

	async googleSignIn (input: { idToken: string, referrer: string | null }) {
		return await this.repository.googleSignIn(input.idToken, input.referrer)
	}

	async appleSignIn (input: { data: { idToken: string, email: string | null, firstName: string | null, lastName: string | null }, referrer: string | null }) {
		return await this.repository.appleSignIn(input.data, input.referrer)
	}

	async registerUser(params: RegisterInput) {
		const userModel: UserToModel = {
			...params,
			isVerified: false,
			authTypes: [AuthTypes.email]
		}

		return await this.repository.addNewUser(userModel, AuthTypes.email)
	}

	async resetPassword(input: PasswordResetInput) {
		return await this.repository.resetPassword(input)
	}

	async sendPasswordResetMail(email: string) {
		return await this.repository.sendPasswordResetMail(email)
	}

	async sendVerificationMail(email: string) {
		return await this.repository.sendVerificationMail(email)
	}

	async verifyEmail(token: string) {
		return await this.repository.verifyEmail(token)
	}
}