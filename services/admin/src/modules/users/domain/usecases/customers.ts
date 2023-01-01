import { ICustomerRepository } from '../irepositories/icustomer'
import { CustomerEntity } from '../entities/customer'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class CustomersUseCase {
	private repository: ICustomerRepository

	constructor (repository: ICustomerRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (driverId: string) {
		const condition: QueryParams = {
			where: [{ field: 'driverId', condition: Conditions.eq, value: driverId }],
			sort: [{ field: 'name', desc: false }],
			all: true
		}
		return await this.repository.get(condition)
	}

	async listenToOne (id: string, listeners: Listeners<CustomerEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async listen (driverId: string, listener: Listeners<CustomerEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'driverId', condition: Conditions.eq, value: driverId }],
			sort: [{ field: 'name', desc: false }],
			all: true
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => entity.driverId === driverId)
	}
}
