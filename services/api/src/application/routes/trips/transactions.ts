import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { TransactionsController } from '../../controllers/trips/transactions'

export const transactionsRoutes = groupRoutes('/transactions', [
	{
		path: '/admin',
		method: 'get',
		controllers: [isAdmin, makeController(async (req) => TransactionsController.getTransactionsAdmin(req))],
	},
	{
		path: '/admin/:id',
		method: 'get',
		controllers: [isAdmin, makeController(async (req) => TransactionsController.findTransactionAdmin(req))],
	},
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.getTransactions(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.findTransaction(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.createTransaction(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.deleteTransaction(req))],
	},
])
