import { TransactionsController } from '@application/controllers/payment/transactions'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const transactionsRoutes = groupRoutes('/transactions', [
	{
		path: '/flutterwave/secrets',
		method: 'get',
		controllers: [makeController(async (req) => TransactionsController.getSecrets(req))],
	},
	{
		path: '/rates',
		method: 'get',
		controllers: [makeController(async (req) => TransactionsController.getRates(req))],
	},
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.find(req))],
	},
	{
		path: '/fund',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.fund(req))],
	},
	{
		path: '/:id/fulfill',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => TransactionsController.fulfill(req))],
	},
])
