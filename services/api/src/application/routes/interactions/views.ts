import { ViewsController } from '@application/controllers/interactions/views'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const viewsRoutes = groupRoutes({ path: '/views', tags: ['Views'] }, [
	{
		path: '/',
		method: 'get',
		handler: ViewsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ViewsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: ViewsController.create,
		middlewares: [isAuthenticated],
	},
])
