import { isAdmin, isAuthenticated } from '@application/middlewares'
import { TripStatus } from '@modules/trips'
import { Route, StatusCodes, makeController } from 'equipped'
import { TripsController } from '../../controllers/trips/trips'

export const tripsRoutes: Route[] = [
	{
		path: '/trips/trips/admin',
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
		path: '/trips/trips/admin/:id',
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
		path: '/trips/trips/',
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
		path: '/trips/trips/:id',
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
		path: '/trips/trips/',
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
		path: '/trips/trips/:id/start',
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
		path: '/trips/trips/:id/end',
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
		path: '/trips/trips/:id/detail',
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