import { makeController, Route, StatusCodes } from 'equipped'
import { CustomersController } from '../../controllers/users/customers'
import { isAdmin, isAuthenticated } from '@application/middlewares'

export const customersRoutes: Route[] = [
	{
		path: '/users/customers/admin/',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CustomersController.getCustomersAdmin(req)
				}
			})
		]
	},
	{
		path: '/users/customers/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await CustomersController.findCustomerAdmin(req)
				}
			})
		]
	},
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