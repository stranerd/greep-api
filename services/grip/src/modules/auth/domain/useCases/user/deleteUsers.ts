import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'

export class DeleteUsersUseCase implements BaseUseCase<string[], void> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (userIds: string[]) {
		return await this.repository.deleteUsers(userIds)
	}
}