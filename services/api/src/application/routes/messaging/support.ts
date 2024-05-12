import { isAdmin, isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { SupportController } from '../../controllers/messaging/support'

export const supportRoutes = groupRoutes('/support', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => SupportController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => SupportController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => SupportController.create(req))],
	},
	{
		path: '/:id/assign',
		method: 'post',
		controllers: [isAuthenticated, isAdmin, makeController(async (req) => SupportController.assign(req))],
	},
])
