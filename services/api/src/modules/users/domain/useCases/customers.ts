import { ICustomerRepository } from '../i-repositories/customers'
import { QueryParams } from '@stranerd/api-commons'

export class CustomersUseCase {
	repository: ICustomerRepository

	constructor (repo: ICustomerRepository) {
		this.repository = repo
	}

	async findCustomer (id: string) {
		return await this.repository.findCustomer(id)
	}

	async getCustomers (query: QueryParams) {
		return await this.repository.getCustomers(query)
	}

	async updateTrip (data: { driverId: string, name: string, count: number }) {
		return await this.repository.updateTrip(data)
	}

	async updateDebt (data: { driverId: string, name: string, count: number }) {
		return await this.repository.updateDebt(data)
	}
}