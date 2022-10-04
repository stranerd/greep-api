import { ICustomerRepository } from '../i-repositories/customers'
import { QueryParams } from '@stranerd/api-commons'

export class CustomersUseCase {
	repository: ICustomerRepository

	constructor (repo: ICustomerRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
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