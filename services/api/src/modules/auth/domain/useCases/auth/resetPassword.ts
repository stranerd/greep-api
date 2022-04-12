import { BaseUseCase } from '@stranerd/api-commons'
import { PasswordResetInput } from '../../types'
import { IAuthRepository } from '../../i-repositories/auth'
import { UserEntity } from '../../entities/users'

export class ResetPasswordUseCase implements BaseUseCase<PasswordResetInput, UserEntity> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (input: PasswordResetInput) {
		return await this.repository.resetPassword(input)
	}
}