import { ReportController } from '@application/controllers/interactions/reports'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const reportsRoutes = groupRoutes({ path: '/reports', groups: ['Reports'] }, [
	{
		path: '/',
		method: 'get',
		handler: ReportController.get,
		middlewares: [isAuthenticated, isAdmin],
	},
	{
		path: '/:id',
		method: 'get',
		handler: ReportController.find,
		middlewares: [isAuthenticated, isAdmin],
	},
	{
		path: '/:id',
		method: 'delete',
		handler: ReportController.delete,
		middlewares: [isAuthenticated, isAdmin],
	},
	{
		path: '/',
		method: 'post',
		handler: ReportController.create,
		middlewares: [isAuthenticated],
	},
])
