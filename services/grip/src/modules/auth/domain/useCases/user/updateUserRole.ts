import { BaseUseCase } from '@stranerd/api-commons'
import { RoleInput } from '../../types'
import { IUserRepository } from '../../i-repositories/users'

export class UpdateUserRoleUseCase implements BaseUseCase<RoleInput, boolean> {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async execute (roleInput: RoleInput) {
		return await this.repository.updateUserRole(roleInput)
	}
}