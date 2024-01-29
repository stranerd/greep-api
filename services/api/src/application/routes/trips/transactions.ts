import { isAdmin, isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { TransactionsController } from '../../controllers/trips/transactions'

export const transactionsRoutes = groupRoutes('/transactions', [
	{
		path: '/admin',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TransactionsController.getTransactionsAdmin(req),
			})),
		],
	},
	{
		path: '/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TransactionsController.findTransactionAdmin(req),
			})),
		],
	},
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TransactionsController.getTransactions(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TransactionsController.findTransaction(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TransactionsController.createTransaction(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TransactionsController.deleteTransaction(req),
			})),
		],
	},
])
