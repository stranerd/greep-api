import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes = groupRoutes('/users', [
	{
		path: '/type',
		method: 'post',
		controllers: [
			isAuthenticatedButIgnoreVerified,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.updateType(req),
			})),
		],
	},
	{
		path: '/application',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.updateApplication(req),
			})),
		],
	},
	{
		path: '/location',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.updateLocation(req),
			})),
		],
	},
	{
		path: '/admin',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.getUsersAdmin(req),
			})),
		],
	},
	{
		path: '/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.findUserAdmin(req),
			})),
		],
	},
	{
		path: '/',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.getUsers(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.findUser(req),
			})),
		],
	},
	{
		path: '/driverAvailability',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.updateDriverAvailability(req),
			})),
		],
	},
	{
		path: '/savedLocations',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await UsersController.updateSavedLocations(req),
			})),
		],
	},
])
