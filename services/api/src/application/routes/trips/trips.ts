import { isAdmin, isAuthenticated, isDriver } from '@application/middlewares'
import { TripStatus } from '@modules/trips'
import { groupRoutes } from 'equipped'
import { TripsController } from '../../controllers/trips/trips'

export const tripsRoutes = groupRoutes({ path: '/trips', groups: ['Trips'] }, [
	{
		path: '/admin',
		method: 'get',
		handler: TripsController.getTripsAdmin,
		middlewares: [isAdmin],
	},
	{
		path: '/admin/:id',
		method: 'get',
		handler: TripsController.findTripAdmin,
		middlewares: [isAdmin],
	},
	{
		path: '/',
		method: 'get',
		handler: TripsController.getTrips,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id',
		method: 'get',
		handler: TripsController.findTrip,
		middlewares: [isAuthenticated],
	},
	{
		path: '/',
		method: 'post',
		handler: TripsController.createTrip,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/driverArrive',
		method: 'post',
		handler: async (req) => TripsController.updateTrip(req, TripStatus.driverArrived),
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/start',
		method: 'post',
		handler: async (req) => TripsController.updateTrip(req, TripStatus.started),
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/end',
		method: 'post',
		handler: async (req) => TripsController.updateTrip(req, TripStatus.ended),
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/cancel',
		method: 'post',
		handler: TripsController.cancelTrip,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/detail',
		method: 'post',
		handler: TripsController.detailTrip,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/accept/requested',
		method: 'post',
		handler: TripsController.acceptRequestedTrip,
		middlewares: [isAuthenticated],
	},
	{
		path: '/:id/accept/nonrequested',
		method: 'post',
		handler: TripsController.acceptNonRequestedTrip,
		middlewares: [isAuthenticated, isDriver],
	},
])
