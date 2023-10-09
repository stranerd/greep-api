import { QueryParams } from 'equipped'
import { RequestToModel } from '../../data/models/requests'
import { IRequestRepository } from '../irepositories/requests'

export class RequestsUseCase {
	repository: IRequestRepository

	constructor (repo: IRequestRepository) {
		this.repository = repo
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async create (data: RequestToModel) {
		return await this.repository.create(data)
	}

	async accept (data: { id: string, userId: string, value: boolean }) {
		return await this.repository.accept(data.id, data.userId, data.value)
	}

	async acknowledge (data: { id: string, userId: string, value: boolean }) {
		return await this.repository.acknowledge(data.id, data.userId, data.value)
	}
}