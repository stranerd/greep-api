import { QueryParams } from 'equipped'
import { IUserRepository } from '../i-repositories/users'
import { UserAccount, UserBio, UserRoles, UserTypeData } from '../types'

export class UsersUseCase {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async findByUsername(username: string) {
		const { results } = await this.repository.get({ where: [{ field: 'bio.username', value: username }] })
		return results.at(0) ?? null
	}

	async createUserWithBio(params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.createUserWithBio(params.id, params.data, params.timestamp)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async markUserAsDeleted(params: { id: string, timestamp: number }) {
		return await this.repository.markUserAsDeleted(params.id, params.timestamp)
	}

	async resetAllUsersStatus() {
		return await this.repository.resetAllUsersStatus()
	}

	async updateUserStatus(input: { userId: string, socketId: string, add: boolean }) {
		return await this.repository.updateUserStatus(input.userId, input.socketId, input.add)
	}

	async updateUserWithBio(params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.updateUserWithBio(params.id, params.data, params.timestamp)
	}

	async updateUserWithRoles(params: { id: string, data: UserRoles, timestamp: number }) {
		return await this.repository.updateUserWithRoles(params.id, params.data, params.timestamp)
	}

	async incrementMeta (params: { id: string, value: 1 | -1, property: keyof UserAccount['meta'] }) {
		return await this.repository.incrementUserMetaProperty(params.id, params.property, params.value)
	}

	async resetRankings (key: keyof UserAccount['rankings']) {
		return await this.repository.resetRankings(key)
	}

	async updateScore (params: { userId: string, amount: number }) {
		return await this.repository.updateScore(params.userId, params.amount)
	}

	async updateType (params: { userId: string, data: UserTypeData }) {
		return await this.repository.updateType(params.userId, params.data)
	}

	async updateApplication (params: { userId: string, data: UserAccount['application'] }) {
		return await this.repository.updateApplication(params.userId, params.data)
	}

	async updateTrip(data: { driverId: string, userId: string, count: number }) {
		return await this.repository.updateTrip(data)
	}

	async updateDebt(data: { driverId: string, userId: string, count: number }) {
		return await this.repository.updateDebt(data)
	}

	async updateLocation (data: { userId: string, location: [number, number] }) {
		return await this.repository.updateLocation(data)
	}

	async updateSettings (params: { userId: string, settings: Partial<UserAccount['settings']>; }) {
		return await this.repository.updateSettings(params.userId, params.settings)
	}
}