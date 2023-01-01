import { ITripRepository } from '../irepositories/itrip'
import { TripEntity } from '../entities/trip'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class TripsUseCase {
	private repository: ITripRepository

	constructor (repository: ITripRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (driverId: string) {
		const condition: QueryParams = {
			where: [{ field: 'driverId', condition: Conditions.eq, value: driverId }],
			sort: [{ field: 'name', desc: false }],
			all: true
		}
		return await this.repository.get(condition)
	}

	async listenToOne (id: string, listeners: Listeners<TripEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async listen (driverId: string, listener: Listeners<TripEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'driverId', condition: Conditions.eq, value: driverId }],
			sort: [{ field: 'name', desc: false }],
			all: true
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => entity.driverId === driverId)
	}
}
