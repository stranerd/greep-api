import { ITripRepository } from '../irepositories/itrip'
import { TripEntity } from '../entities/trip'
import { Listeners } from '@modules/core'

export class TripsUseCase {
	private repository: ITripRepository

	constructor (repository: ITripRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async listenToOne (id: string, listeners: Listeners<TripEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}
}
