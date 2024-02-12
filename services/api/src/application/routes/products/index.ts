import { ProductController } from '@application/controllers/products'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const productRoutes = groupRoutes('/products', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ProductController.get(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ProductController.create(req),
			})),
		],
	},

	{
		path: '/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ProductController.update(req),
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
				result: await ProductController.delete(req),
			})),
		],
	},
])
