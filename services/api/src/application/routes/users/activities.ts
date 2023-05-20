import { isAuthenticated } from '@application/middlewares'
import { Route, StatusCodes, makeController } from 'equipped'
import { ActivitiesController } from '../../controllers/users/activities'

export const activitiesRoutes: Route[] = [
	{
		path: '/users/activities/',
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
		path: '/users/activities/:id',
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
]