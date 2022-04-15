import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { TransactionsController } from '../../controllers/users/transactions'

export const transactionsRoutes: Route[] = [
	{
		path: '/users/transactions/',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.getTransactions(req)
				}
			})
		]
	},
	{
		path: '/users/transactions/:id',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.findTransaction(req)
				}
			})
		]
	},
	{
		path: '/users/transactions/',
		method: 'post',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.createTransaction(req)
				}
			})
		]
	},
	{
		path: '/users/transactions/:id',
		method: 'delete',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TransactionsController.deleteTransaction(req)
				}
			})
		]
	}
]