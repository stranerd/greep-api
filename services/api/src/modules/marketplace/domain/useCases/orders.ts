import { QueryParams } from 'equipped'
import { IOrderRepository } from '../irepositories/orders'
import { AcceptOrderInput, CheckoutInput } from '../types'

export class OrderUseCase {
	private repository: IOrderRepository

	constructor(repository: IOrderRepository) {
		this.repository = repository
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

	async generateToken(data: { id: string; userId: string }) {
		return await this.repository.generateToken(data.id, data.userId)
	}

	async complete(data: { id: string; userId: string; token: string }) {
		return await this.repository.complete(data.id, data.userId, data.token)
	}

	async markPaid(id: string) {
		return await this.repository.markPaid(id)
	}
}
