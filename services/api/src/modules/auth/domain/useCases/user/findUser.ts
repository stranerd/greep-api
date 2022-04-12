import { BaseUseCase } from '@stranerd/api-commons'
import { UserEntity } from '../../entities/users'
import { IUserRepository } from '../../i-repositories/users'

export class FindUserUseCase implements BaseUseCase<string, UserEntity | null> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (id: string) {
		return await this.repository.findUser(id)
	}
}