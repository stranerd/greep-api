import { TransactionsController } from '@application/controllers/payment/transactions'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const transactionsRoutes = groupRoutes({ path: '/transactions', tags: ['Transactions'] }, [
	{
		path: '/flutterwave/secrets',
		method: 'get',
		handler: TransactionsController.getSecrets,
	},
	{
		path: '/rates',
		method: 'get',
		handler: TransactionsController.getRates,
	},
	{
		path: '/',
		method: 'get',
		handler: TransactionsController.get,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'get',
		handler: TransactionsController.find,
		middlewares: [isAuthenticated],
	},
	{
		path: '/fund',
		method: 'post',
		handler: TransactionsController.fund,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/fulfill',
		method: 'put',
		handler: TransactionsController.fulfill,
		middlewares: [isAuthenticated],
	},
])
