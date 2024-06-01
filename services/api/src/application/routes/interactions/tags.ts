import { TagController } from '@application/controllers/interactions/tags'
import { isAdmin } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const tagsRoutes = groupRoutes({ path: '/tags', groups: ['Tags'] }, [
	{
		path: '/',
		method: 'get',
		handler: TagController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: TagController.find,
	},
	{
		path: '/:id',
		method: 'put',
		handler: TagController.update,
		middlewares: [isAdmin],
	},
	{
		path: '/',
		method: 'post',
		handler: TagController.create,
	},
	{
		path: '/:id',
		method: 'delete',
		handler: TagController.delete,
		middlewares: [isAdmin],
	},
])
