import { CustomersUseCases } from '@modules/users'
import { NotFoundError, QueryParams, Request } from '@stranerd/api-commons'

export class CustomersController {
	static async getCustomers (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }]
		return await CustomersUseCases.get(query)
	}

	static async findCustomer (req: Request) {
		const customer = await CustomersUseCases.find(req.params.id)
		if (!customer || customer.driverId !== req.authUser!.id) throw new NotFoundError()
		return customer
	}
}