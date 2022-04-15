import { CustomersUseCases } from '@modules/users'
import { QueryParams, Request } from '@stranerd/api-commons'

export class CustomersController {
	static async getCustomers (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }]
		return await CustomersUseCases.get(query)
	}

	static async findCustomer (req: Request) {
		return await CustomersUseCases.find({ id: req.params.id, userId: req.authUser!.id })
	}
}