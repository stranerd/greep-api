import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { CustomersController } from '../../controllers/users/customers'
import { isAuthenticated } from '@application/middlewares'

export const customersRoutes: Route[] = [
	{
		path: '/users/customers/',
		method: 'get',
		controllers: [
			isAuthenticated,
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
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CustomersController.findCustomer(req)
				}
			})
		]
	}
]