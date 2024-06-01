import { MediasController as MediaController } from '@application/controllers/interactions/media'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const mediaRoutes = groupRoutes({ path: '/media', groups: ['Media'] }, [
	{
		path: '/',
		method: 'get',
		handler: MediaController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: MediaController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: MediaController.create,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'put',
		handler: MediaController.update,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: MediaController.delete,
		middlewares: [isAuthenticated],
	},
	{
		path: '/reorder',
		method: 'post',
		handler: MediaController.reorder,
		middlewares: [isAuthenticated],
	},
])
