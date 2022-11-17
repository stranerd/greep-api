import { QueryParams } from '@stranerd/api-commons'
import { ITripRepository } from '../i-repositories/trips'
import { TripToModel } from '../../data/models/trips'
import { TransactionToModel } from '../../data/models/transactions'

export class TripsUseCase {
	repository: ITripRepository

	constructor (repo: ITripRepository) {
		this.repository = repo
	}

	async create (input: TripToModel) {
		return await this.repository.create(input)
	}

	async update (input: { driverId: string, id: string, data: Partial<TripToModel> }) {
		return await this.repository.update(input)
	}

	async detail (input: { driverId: string, id: string, data: TransactionToModel }) {
		return await this.repository.detail(input)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}
}