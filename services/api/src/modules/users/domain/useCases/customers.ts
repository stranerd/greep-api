import { ICustomerRepository } from '../i-repositories/customers'
import { QueryParams } from '@stranerd/api-commons'

export class CustomersUseCase {
	repository: ICustomerRepository

	constructor (repo: ICustomerRepository) {
		this.repository = repo
	}

	async find (data: { id: string, userId: string }) {
		return await this.repository.find(data)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateTrip (data: { driverId: string, name: string, count: number }) {
		return await this.repository.updateTrip(data)
	}

	async updateDebt (data: { driverId: string, name: string, count: number }) {
		return await this.repository.updateDebt(data)
	}
}