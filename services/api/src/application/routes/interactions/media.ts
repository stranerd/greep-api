import { MediasController as MediaController } from '@application/controllers/interactions/media'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const mediaRoutes = groupRoutes('/media', [
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => MediaController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => MediaController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MediaController.create(req))],
	},
	{
		path: '/:id',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => MediaController.update(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, makeController(async (req) => MediaController.delete(req))],
	},
	{
		path: '/reorder',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => MediaController.reorder(req))],
	},
])
