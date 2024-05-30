import { NotificationsController } from '@application/controllers/notifications/notifications'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const notificationsRoutes = groupRoutes({ path: '/notifications', tags: ['Notifications'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: NotificationsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: NotificationsController.find,
	},
	{
		path: '/seen',
		method: 'put',
		handler: NotificationsController.markAllSeen,
	},
	{
		path: '/:id/seen',
		method: 'put',
		handler: NotificationsController.markSeen,
	},
])
