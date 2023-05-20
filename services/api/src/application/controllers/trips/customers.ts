import { CustomersUseCases } from '@modules/trips'
import { NotFoundError, QueryParams, Request } from 'equipped'

export class CustomersController {
	static async getCustomers(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }]
		return await CustomersUseCases.get(query)
	}

	static async getCustomersAdmin(req: Request) {
		const query = req.query as QueryParams
		return await CustomersUseCases.get(query)
	}

	static async findCustomer(req: Request) {
		const customer = await CustomersUseCases.find(req.params.id)
		if (!customer || customer.driverId !== req.authUser!.id) throw new NotFoundError()
		return customer
	}

	static async findCustomerAdmin(req: Request) {
		const customer = await CustomersUseCases.find(req.params.id)
		if (!customer) throw new NotFoundError()
		return customer
	}
}