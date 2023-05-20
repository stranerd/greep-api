import { isAdmin, isAuthenticated } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { TransactionsController } from '../../controllers/trips/transactions'

export const transactionsRoutes: Route[] = [
	{
		path: '/trips/transactions/admin',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.getTransactionsAdmin(req)
				}
			})
		]
	},
	{
		path: '/trips/transactions/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.findTransactionAdmin(req)
				}
			})
		]
	},
	{
		path: '/trips/transactions/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.getTransactions(req)
				}
			})
		]
	},
	{
		path: '/trips/transactions/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.findTransaction(req)
				}
			})
		]
	},
	{
		path: '/trips/transactions/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.createTransaction(req)
				}
			})
		]
	},
	{
		path: '/trips/transactions/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.deleteTransaction(req)
				}
			})
		]
	}
]