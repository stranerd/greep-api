import { CustomersUseCases } from '@modules/users'
import { QueryParams, Request } from '@stranerd/api-commons'

export class CustomersController {
	static async getCustomers (req: Request) {
		const query = req.query as QueryParams
		return await CustomersUseCases.getCustomers(query)
	}

	static async findCustomer (req: Request) {
		return await CustomersUseCases.findCustomer(req.params.id)
	}
}