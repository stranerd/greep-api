import { QueryParams } from 'equipped'
import { IOrderRepository } from '../irepositories/orders'

export class OrderUseCase {
	private repository: IOrderRepository

	constructor(repository: IOrderRepository) {
		this.repository = repository
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
