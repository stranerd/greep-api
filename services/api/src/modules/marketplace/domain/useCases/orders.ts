import { QueryParams } from 'equipped'
import { OrderToModel } from '../../data/models/orders'
import { IOrderRepository } from '../irepositories/orders'
import { AcceptOrderInput } from '../types'

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

	async accept(input: AcceptOrderInput) {
		return await this.repository.accept(input)
	}
}
