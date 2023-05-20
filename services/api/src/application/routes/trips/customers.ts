import { makeController, Route, StatusCodes } from 'equipped'
import { CustomersController } from '../../controllers/trips/customers'
import { isAdmin, isAuthenticated } from '@application/middlewares'

export const customersRoutes: Route[] = [
	{
		path: '/trips/customers/admin/',
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
		path: '/trips/customers/admin/:id',
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
		path: '/trips/customers/',
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
		path: '/trips/customers/:id',
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