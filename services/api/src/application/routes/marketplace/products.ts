import { ProductsController } from '@application/controllers/marketplace/products'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const productsRoutes = groupRoutes('/products', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ProductsController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ProductsController.find(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ProductsController.delete(req),
			})),
		],
	},
])
