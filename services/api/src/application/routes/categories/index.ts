import { CategoryController } from '@application/controllers/categories'
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
				result: await CategoryController.get(req),
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
				result: await CategoryController.create(req),
			})),
		],
	},
])
