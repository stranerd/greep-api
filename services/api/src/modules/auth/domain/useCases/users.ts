import { QueryKeys, QueryParams } from 'equipped'
import { IUserRepository } from '../i-repositories/users'
import { RegisterInput, RoleInput, UserUpdateInput } from '../types'

export class AuthUsersUseCase {
	private repository: IUserRepository

	constructor(repository: IUserRepository) {
		this.repository = repository
	}

	async deleteUsers(userIds: string[]) {
		return await this.repository.deleteUsers(userIds)
	}

	async findUser(id: string) {
		return await this.repository.findUser(id)
	}

	async findUsersByEmailorUsername(value: string) {
		const res = await this.repository.getUsers({
			where: [
				{ field: 'email', value: value.toLowerCase() },
				{ field: 'username', value: value.toLowerCase() },
			],
			whereType: QueryKeys.or,
			limit: 1,
		})
		return res.results
	}

	async findUserByEmail(value: string) {
		const res = await this.repository.getUsers({
			where: [{ field: 'email', value: value.toLowerCase() }],
			limit: 1,
		})
		return res.results.at(0) ?? null
	}

	async getUsers(data: QueryParams) {
		return await this.repository.getUsers(data)
	}

	async updatePassword(input: { userId: string; password: string }) {
		return await this.repository.updatePassword(input.userId, input.password)
	}

	async updateDetails(input: { userId: string; data: RegisterInput }) {
		return await this.repository.updateDetails(input.userId, input.data)
	}

	async updateProfile(input: { userId: string; data: UserUpdateInput }) {
		return await this.repository.updateUserProfile(input.userId, input.data)
	}

	async updateRole(roleInput: RoleInput) {
		return await this.repository.updateUserRole(roleInput)
	}

	async count_riders() {
		return await this.repository.count_riders()
	}

	async count_vendors() {
		return await this.repository.count_vendors()
	}
}
