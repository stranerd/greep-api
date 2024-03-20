import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes = groupRoutes('/users', [
	{
		path: '/type',
		method: 'post',
		controllers: [isAuthenticatedButIgnoreVerified, makeController(async (req) => UsersController.updateType(req))],
	},
	{
		path: '/application',
		method: 'post',
		controllers: [isAdmin, makeController(async (req) => UsersController.updateApplication(req))],
	},
	{
		path: '/location',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateLocation(req))],
	},
	{
		path: '/admin',
		method: 'get',
		controllers: [isAdmin, makeController(async (req) => UsersController.getUsersAdmin(req))],
	},
	{
		path: '/admin/:id',
		method: 'get',
		controllers: [isAdmin, makeController(async (req) => UsersController.findUserAdmin(req))],
	},
	{
		path: '/',
		method: 'get',
		controllers: [makeController(async (req) => UsersController.getUsers(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [makeController(async (req) => UsersController.findUser(req))],
	},
	{
		path: '/driverAvailability',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateDriverAvailability(req))],
	},
	{
		path: '/vendorLocation',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateVendorLocation(req))],
	},
	{
		path: '/savedLocations',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => UsersController.updateSavedLocations(req))],
	},
])
