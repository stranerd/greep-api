import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { TransactionsController } from '../../controllers/trips/transactions'

export const transactionsRoutes = groupRoutes({ path: '/transactions', groups: ['Transactions'] }, [
	{
		path: '/admin',
		method: 'get',
		handler: TransactionsController.getTransactionsAdmin,
		middlewares: [isAdmin],
	},
	{
		path: '/admin/:id',
		method: 'get',
		handler: TransactionsController.findTransactionAdmin,
		middlewares: [isAdmin],
	},
	{
		path: '/',
		method: 'get',
		handler: TransactionsController.getTransactions,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'get',
		handler: TransactionsController.findTransaction,
		middlewares: [isAuthenticated],
	},
	{
		path: '/',
		method: 'post',
		handler: TransactionsController.createTransaction,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: TransactionsController.deleteTransaction,
		middlewares: [isAuthenticated],
	},
])
