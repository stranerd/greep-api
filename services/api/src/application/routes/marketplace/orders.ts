import { OrdersController } from '@application/controllers/marketplace/orders'
import { isAdmin, isAuthenticated, isDriver } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const ordersRoutes = groupRoutes({ path: '/orders', groups: ['Orders'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: OrdersController.get,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'get',
		handler: OrdersController.find,
	},
	{
		path: '/checkout',
		method: 'post',
		handler: OrdersController.checkout,
	},
	{
		path: '/checkout/fee',
		method: 'post',
		handler: OrdersController.checkout,
	},
	{
		path: '/dispatch',
		method: 'post',
		handler: OrdersController.dispatch,
	},
	{
		path: '/dispatch/fee',
		method: 'post',
		handler: OrdersController.dispatchFee,
	},
	{
		path: '/:id/pay',
		method: 'post',
		handler: OrdersController.pay,
	},
	{
		path: '/:id/accept',
		method: 'post',
		handler: OrdersController.accept,
		middlewares: [isAdmin],
	},
	{
		path: '/:id/token',
		method: 'post',
		handler: OrdersController.generateToken,
	},
	{
		path: '/:id/complete',
		method: 'post',
		handler: OrdersController.complete,
	},
	{
		path: '/:id/assignDriver',
		method: 'post',
		handler: OrdersController.assignDriver,
		middlewares: [isDriver],
	},
	{
		path: '/:id/markPaid',
		method: 'post',
		handler: OrdersController.markPaid,
		middlewares: [isDriver],
	},
	{
		path: '/:id/markShipped',
		method: 'post',
		handler: OrdersController.markShipped,
	},
	{
		path: '/:id/cancel',
		method: 'post',
		handler: OrdersController.cancel,
	},
])
