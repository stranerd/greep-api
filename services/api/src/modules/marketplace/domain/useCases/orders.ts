import { QueryParams } from 'equipped'
import { OrderToModel } from '../../data/models/orders'
import { IOrderRepository } from '../irepositories/orders'
import { AcceptOrderInput, CheckoutInput } from '../types'

export class OrderUseCase {
	private repository: IOrderRepository

	constructor(repository: IOrderRepository) {
		this.repository = repository
	}

	async create(data: OrderToModel) {
		return await this.repository.create(data)
	}

	async checkout(data: CheckoutInput) {
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

	async assignDriver(data: { id: string; driverId: string }) {
		return await this.repository.assignDriver(data.id, data.driverId)
	}

	async cancel(data: { id: string; userId: string }) {
		return await this.repository.cancel(data.id, data.userId)
	}

	async generateToken(data: { id: string; userId: string }) {
		return await this.repository.generateToken(data.id, data.userId)
	}

	async complete(data: { id: string; userId: string; token: string }) {
		return await this.repository.complete(data.id, data.userId, data.token)
	}

	async markShipped(data: { id: string; userId: string }) {
		return await this.repository.markShipped(data.id, data.userId)
	}

	async markPaid(data: { id: string; driverId: string | null }) {
		return await this.repository.markPaid(data.id, data.driverId)
	}

	async markRefunded(data: { id: string }) {
		return await this.repository.markRefunded(data.id)
	}
}
