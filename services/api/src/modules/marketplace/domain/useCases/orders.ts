import { OrderToModel } from '../../data/models/orders'
import { QueryParams } from 'equipped'
import { IOrderRepository } from '../irepositories/orders'

export class OrderUseCase {
	private repository: IOrderRepository

	constructor(repository: IOrderRepository) {
		this.repository = repository
	}

	async checkout(data: OrderToModel) {
		return await this.repository.checkout(data)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
