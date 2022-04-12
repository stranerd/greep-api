import { BaseUseCase } from '@stranerd/api-commons'
import { IUserRepository } from '../../i-repositories/users'
import { UserRoles } from '../../types'

type Input = { id: string, data: UserRoles, timestamp: number }

export class UpdateUserWithRolesUseCase implements BaseUseCase<Input, void> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (params: Input) {
		return await this.repository.updateUserWithRoles(params.id, params.data, params.timestamp)
	}
}