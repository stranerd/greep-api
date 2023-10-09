import { isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { ActivitiesController } from '../../controllers/users/activities'

export const activitiesRoutes = groupRoutes('/activities', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ActivitiesController.get(req)
				}
			})
		]
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ActivitiesController.find(req)
				}
			})
		]
	}
])