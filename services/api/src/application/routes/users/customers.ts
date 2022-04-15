import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { CustomersController } from '../../controllers/users/customers'

export const customersRoutes: Route[] = [
	{
		path: '/users/customers/',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CustomersController.getCustomers(req)
				}
			})
		]
	},
	{
		path: '/users/customers/:id',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CustomersController.findCustomer(req)
				}
			})
		]
	}
]