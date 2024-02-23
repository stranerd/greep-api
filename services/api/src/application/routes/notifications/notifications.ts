import { NotificationsController } from '@application/controllers/notifications/notifications'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const notificationsRoutes = groupRoutes('/notifications', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => NotificationsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => NotificationsController.find(req))],
	},
	{
		path: '/seen',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => NotificationsController.markAllSeen(req))],
	},
	{
		path: '/:id/seen',
		method: 'put',
		controllers: [isAuthenticated, makeController(async (req) => NotificationsController.markSeen(req))],
	},
])
