import { CartsController } from '@application/controllers/marketplace/carts'
import { isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const cartsRoutes = groupRoutes('/carts', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await CartsController.get(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await CartsController.add(req),
			})),
		],
	},
	{
		path: '/:id/checkout',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await CartsController.checkout(req),
			})),
		],
	},
])
