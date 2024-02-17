import { ReportController } from '@application/controllers/interactions/reports'
import { groupRoutes, makeController, StatusCodes } from 'equipped'
import { isAdmin, isAuthenticated } from '@application/middlewares'

export const reportsRoutes = groupRoutes('/reports', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ReportController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ReportController.find(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ReportController.delete(req),
			})),
		],
	},
	{
		path: '/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await ReportController.create(req),
			})),
		],
	},
])
