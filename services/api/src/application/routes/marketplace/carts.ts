import { CartsController } from '@application/controllers/marketplace/carts'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const cartsRoutes = groupRoutes('/carts', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => CartsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => CartsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CartsController.add(req))],
	},
	{
		path: '/:id/checkout',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => CartsController.checkout(req))],
	},
])
