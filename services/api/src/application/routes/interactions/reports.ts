import { ReportController } from '@application/controllers/interactions/reports'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const reportsRoutes = groupRoutes('/reports', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => ReportController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => ReportController.find(req))],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => ReportController.delete(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => ReportController.create(req))],
	},
])
