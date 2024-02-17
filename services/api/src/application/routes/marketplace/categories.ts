import { CategoriesController } from '@application/controllers/marketplace/categories'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'

export const categoriesRoutes = groupRoutes('/categories', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await CategoriesController.get(req),
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
				result: await CategoriesController.create(req),
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
				result: await CategoriesController.find(req),
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
				result: await CategoriesController.update(req),
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
				result: await CategoriesController.delete(req),
			})),
		],
	},
])
