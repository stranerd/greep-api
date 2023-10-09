import { isAdmin, isAuthenticated } from '@application/middlewares'
import { TripStatus } from '@modules/trips'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { TripsController } from '../../controllers/trips/trips'

export const tripsRoutes = groupRoutes('/trips', [
	{
		path: '/admin',
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
		path: '/admin/:id',
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
		path: '/',
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
		path: '/:id',
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
		path: '/',
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
		path: '/:id/driverArrive',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.updateTrip(req, TripStatus.driverArrived)
				}
			})
		]
	},
	{
		path: '/:id/start',
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
		path: '/:id/end',
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
		path: '/:id/cancel',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.cancelTrip(req)
				}
			})
		]
	},
	{
		path: '/:id/detail',
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
	},
	{
		path: '/:id/accept/requested',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.acceptRequestedTrip(req)
				}
			})
		]
	},
	{
		path: '/:id/accept/nonrequested',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TripsController.acceptNonRequestedTrip(req)
				}
			})
		]
	}
])