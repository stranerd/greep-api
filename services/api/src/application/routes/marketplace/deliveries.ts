import { DeliveriesController } from '@application/controllers/marketplace/deliveries'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const deliveriesRoutes = groupRoutes('/deliveries', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => DeliveriesController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => DeliveriesController.find(req))],
	},
	{
		path: '/:id/token',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => DeliveriesController.generateToken(req))],
	},
	{
		path: '/:id/complete',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => DeliveriesController.complete(req))],
	},
])
