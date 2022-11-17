import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { TripsController } from '../../controllers/users/trips'
import { isAuthenticated } from '@application/middlewares'

export const tripsRoutes: Route[] = [
	{
		path: '/users/trips/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.getTrips(req)
				}
			})
		]
	},
	{
		path: '/users/trips/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.findTrip(req)
				}
			})
		]
	},
	{
		path: '/users/trips/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.createTrip(req)
				}
			})
		]
	},
	{
		path: '/users/trips/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.updateTrip(req)
				}
			})
		]
	}
]