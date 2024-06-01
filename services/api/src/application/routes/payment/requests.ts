import { RequestsController } from '@application/controllers/payment/requests'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const requestsRoutes = groupRoutes({ path: '/requests', groups: ['Requests'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: RequestsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: RequestsController.find,
	},
	{
		path: '/',
		method: 'post',
		handler: RequestsController.create,
	},
	{
		path: '/:id/reject',
		method: 'post',
		handler: RequestsController.reject,
	},
	{
		path: '/:id/accept',
		method: 'post',
		handler: RequestsController.accept,
	},
	{
		path: '/:id/acknowledge',
		method: 'post',
		handler: RequestsController.acknowledge,
	},
])
