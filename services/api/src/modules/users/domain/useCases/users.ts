import { IUserRepository } from '../i-repositories/users'
import { UserBio, UserRoles } from '@modules/users'
import { QueryParams } from '@stranerd/api-commons'

export class UsersUseCase {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async findUser (id: string) {
		return await this.repository.findUser(id)
	}

	async createUserWithBio (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.createUserWithBio(params.id, params.data, params.timestamp)
	}

	async getUsers (query: QueryParams) {
		return await this.repository.getUsers(query)
	}

	async markUserAsDeleted (params: { id: string, timestamp: number }) {
		return await this.repository.markUserAsDeleted(params.id, params.timestamp)
	}

	async resetAllUsersStatus () {
		return await this.repository.resetAllUsersStatus()
	}

	async updateUserStatus (input: { userId: string, socketId: string, add: boolean }) {
		return await this.repository.updateUserStatus(input.userId, input.socketId, input.add)
	}

	async updateUserWithBio (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.updateUserWithBio(params.id, params.data, params.timestamp)
	}

	async updateUserWithRoles (params: { id: string, data: UserRoles, timestamp: number }) {
		return await this.repository.updateUserWithRoles(params.id, params.data, params.timestamp)
	}
}