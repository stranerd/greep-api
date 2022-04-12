import { BaseUseCase } from '@stranerd/api-commons'
import { IAuthRepository } from '../../i-repositories/auth'
import { UserEntity } from '../../entities/users'

export class VerifyEmailUseCase implements BaseUseCase<string, UserEntity> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (token: string) {
		return await this.repository.verifyEmail(token)
	}
}