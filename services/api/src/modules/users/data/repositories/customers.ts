import { ICustomerRepository } from '../../domain/i-repositories/customers'
import { CustomerMapper } from '../mappers/customers'
import { Customer } from '../mongooseModels/customers'
import { parseQueryParams } from '@stranerd/api-commons'
import { CustomerFromModel } from '../models/customers'

export class CustomerRepository implements ICustomerRepository {
	private static instance: CustomerRepository
	private mapper = new CustomerMapper()

	static getInstance (): CustomerRepository {
		if (!CustomerRepository.instance) CustomerRepository.instance = new CustomerRepository()
		return CustomerRepository.instance
	}

	async get (query) {
		const data = await parseQueryParams<CustomerFromModel>(Customer, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async find ({ id, userId }: { id: string, userId: string }) {
		const customer = await Customer.findOne({ _id: id, driverId: userId })
		return this.mapper.mapFrom(customer)
	}

	async updateTrip ({ driverId, name, count }: { driverId: string, name: string, count: number }) {
		const customer = await Customer.findOneAndUpdate({ driverId, name }, {
			$setOnInsert: { driverId, name },
			$inc: { trip: count }
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