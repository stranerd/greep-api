import { RequestsController } from '@application/controllers/payment/requests'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const requestsRoutes = groupRoutes('/requests', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => RequestsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => RequestsController.find(req))],
	},
	{
		path: '/',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => RequestsController.create(req))],
	},
	{
		path: '/:id/reject',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => RequestsController.reject(req))],
	},
	{
		path: '/:id/accept',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => RequestsController.accept(req))],
	},
	{
		path: '/:id/acknowledge',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => RequestsController.acknowledge(req))],
	},
])
