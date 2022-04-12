import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'

export class ResetAllUsersStatusUseCase implements BaseUseCase<void, boolean> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute () {
		return await this.repository.resetAllUsersStatus()
	}
}