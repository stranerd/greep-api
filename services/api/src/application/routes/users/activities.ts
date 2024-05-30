import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { ActivitiesController } from '../../controllers/users/activities'

export const activitiesRoutes = groupRoutes({ path: '/activities', tags: ['Activities'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ActivitiesController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ActivitiesController.find,
	},
])
