import { appInstance } from '@utils/environment'
import { ICustomerRepository } from '../../domain/i-repositories/customers'
import { CustomerMapper } from '../mappers/customers'
import { Customer } from '../mongooseModels/customers'

export class CustomerRepository implements ICustomerRepository {
	private static instance: CustomerRepository
	private mapper = new CustomerMapper()

	static getInstance (): CustomerRepository {
		if (!CustomerRepository.instance) CustomerRepository.instance = new CustomerRepository()
		return CustomerRepository.instance
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(Customer, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async find (id: string) {
		const customer = await Customer.findById(id)
		return this.mapper.mapFrom(customer)
	}

	async updateTrip ({ driverId, name, count }: { driverId: string, name: string, count: number }) {
		const customer = await Customer.findOneAndUpdate({ driverId, name }, {
			$setOnInsert: { driverId, name },
			$inc: { trips: count }
		}, { upsert: true, new: true })
		return !!customer
	}

	async updateDebt ({ driverId, name, count }: { driverId: string, name: string, count: number }) {
		const customer = await Customer.findOneAndUpdate({ driverId, name }, {
			$setOnInsert: { driverId, name },
			$inc: { debt: count }
		}, { upsert: true, new: true })
		return !!customer
	}
}