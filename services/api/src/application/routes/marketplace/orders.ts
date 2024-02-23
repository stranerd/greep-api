import { OrdersController } from '@application/controllers/marketplace/orders'
import { isAdmin, isAuthenticated } from '@application/middlewares'
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
		path: '/:id/accept',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => OrdersController.accept(req))],
	},
])
