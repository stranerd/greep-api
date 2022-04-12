import { AuthTypes, BaseUseCase } from '@stranerd/api-commons'
import { Credential } from '../../types'
import { IAuthRepository } from '../../i-repositories/auth'
import { UserEntity } from '../../entities/users'

export class AuthenticateUserUseCase implements BaseUseCase<Credential, UserEntity> {
	repository: IAuthRepository

	constructor (repo: IAuthRepository) {
		this.repository = repo
	}

	async execute (params: Credential) {
		return await this.repository.authenticateUser(params, true, AuthTypes.email)
	}
}