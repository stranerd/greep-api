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
])
