import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { SupportController } from '../../controllers/messaging/support'

export const supportRoutes = groupRoutes({ path: '/support', tags: ['Support'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: SupportController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: SupportController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: SupportController.create,
	},
	{
		path: '/:id/assign',
		method: 'post',
		handler: SupportController.assign,
		middlewares: [isAdmin],
	},
])
