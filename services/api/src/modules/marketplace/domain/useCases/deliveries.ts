import { QueryParams } from 'equipped'
import { DeliveryToModel } from '../../data/models/deliveries'
import { IDeliveryRepository } from '../irepositories/deliveries'

export class DeliveryUseCase {
	repository: IDeliveryRepository

	constructor(repo: IDeliveryRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async create(data: DeliveryToModel) {
		return await this.repository.create(data)
	}

	async update(data: { id: string; data: Partial<DeliveryToModel> }) {
		return await this.repository.update(data.id, data.data)
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
}
