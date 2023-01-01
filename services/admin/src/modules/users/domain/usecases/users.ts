import { IUserRepository } from '../irepositories/iuser'
import { UserEntity } from '../entities/user'
import { Conditions, Listeners, QueryParams } from '@modules/core'
import { PAGINATION_LIMIT } from '@utils/constants'

const searchFields = ['bio.name.first', 'bio.name.last', 'bio.name.full', 'bio.email']

export class UsersUseCase {
	private repository: IUserRepository

	constructor (repository: IUserRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (date?: number) {
		const condition: QueryParams = {
			sort: [{ field: 'dates.createdAt', desc: true }],
			limit: PAGINATION_LIMIT
		}
		if (date) condition.where = [{ field: 'dates.createdAt', value: date, condition: Conditions.lt }]
		return await this.repository.get(condition)
	}

	async getAllAdmins () {
		return await this.repository.get({
			where: [{ field: 'roles.isAdmin', value: true }]
		})
	}

	async getUsersInList (ids: string[]) {
		const users = await this.repository.get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true
		})
		return users.results
	}

	async listenToAllAdmins (listener: Listeners<UserEntity>) {
		return await this.repository.listenToMany({
			where: [{ field: 'roles.isAdmin', value: true }],
			all: true
		}, listener, (entity) => entity.roles.isAdmin)
	}

	async listenToOne (id: string, listeners: Listeners<UserEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async listen (listener: Listeners<UserEntity>, date?: number) {
		const conditions: QueryParams = {
			sort: [{ field: 'dates.createdAt', desc: true }],
			all: true
		}
		if (date) conditions.where = [{ field: 'dates.createdAt', condition: Conditions.gt, value: date }]

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			if (date) return entity.dates.createdAt >= date
			return true
		})
	}

	async listenToUsersInList (ids: string[], listener: Listeners<UserEntity>) {
		return await this.repository.listenToMany({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true
		}, listener, (entity) => ids.includes(entity.id))
	}

	async search (detail: string) {
		const query: QueryParams = {
			all: true, search: { value: detail, fields: searchFields }
		}
		return (await this.repository.get(query)).results
	}
}
