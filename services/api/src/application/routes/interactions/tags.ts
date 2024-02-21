import { TagController } from '@application/controllers/interactions/tags'
import { isAdmin } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const tagsRoutes = groupRoutes('/tags', [
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TagController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TagController.find(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TagController.update(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TagController.create(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await TagController.delete(req),
			})),
		],
	},
])
