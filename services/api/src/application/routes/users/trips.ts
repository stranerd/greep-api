import { makeController, Route, StatusCodes } from 'equipped'
import { TripsController } from '../../controllers/users/trips'
import { isAdmin, isAuthenticated } from '@application/middlewares'
import { TripStatus } from '@modules/users'

export const tripsRoutes: Route[] = [
	{
		path: '/users/trips/admin',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.getTripsAdmin(req)
				}
			})
		]
	},
	{
		path: '/users/trips/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.findTripAdmin(req)
				}
			})
		]
	},
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
		path: '/users/trips/:id/start',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.updateTrip(req, TripStatus.started)
				}
			})
		]
	},
	{
		path: '/users/trips/:id/end',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.updateTrip(req, TripStatus.ended)
				}
			})
		]
	},
	{
		path: '/users/trips/:id/detail',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.detailTrip(req)
				}
			})
		]
	}
]