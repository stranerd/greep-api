import { OrdersController } from '@application/controllers/marketplace/orders'
import { isAdmin, isAuthenticated, isDriver } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const ordersRoutes = groupRoutes('/orders', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.find(req))],
	},
	{
		path: '/checkout',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.checkout(req))],
	},
	{
		path: '/checkout/fee',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.checkoutFee(req))],
	},
	{
		path: '/dispatch',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.dispatch(req))],
	},
	{
		path: '/dispatch/fee',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.dispatchFee(req))],
	},
	{
		path: '/:id/pay',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.pay(req))],
	},
	{
		path: '/:id/accept',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => OrdersController.accept(req))],
	},
	{
		path: '/:id/token',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.generateToken(req))],
	},
	{
		path: '/:id/complete',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.complete(req))],
	},
	{
		path: '/:id/assignDriver',
		method: 'post',
		controllers: [isAuthenticated, isDriver, makeController(async (req) => OrdersController.assignDriver(req))],
	},
	{
		path: '/:id/markPaid',
		method: 'post',
		controllers: [isAuthenticated, isDriver, makeController(async (req) => OrdersController.markPaid(req))],
	},
	{
		path: '/:id/markShipped',
		method: 'post',
		controllers: [isAuthenticated, isDriver, makeController(async (req) => OrdersController.markShipped(req))],
	},
	{
		path: '/:id/cancel',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => OrdersController.cancel(req))],
	},
])
