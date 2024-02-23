import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { ActivitiesController } from '../../controllers/users/activities'

export const activitiesRoutes = groupRoutes('/activities', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ActivitiesController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ActivitiesController.find(req))],
	},
])
