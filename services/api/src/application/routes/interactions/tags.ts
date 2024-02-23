import { TagController } from '@application/controllers/interactions/tags'
import { isAdmin } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const tagsRoutes = groupRoutes('/tags', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => TagController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => TagController.find(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAdmin, makeController(async (req) => TagController.update(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAdmin, makeController(async (req) => TagController.create(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAdmin, makeController(async (req) => TagController.delete(req))],
	},
])
