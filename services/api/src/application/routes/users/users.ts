import { isAdmin, isAuthenticated, isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes = groupRoutes({ path: '/users', tags: ['Users'] }, [
	{
		path: '/type',
		method: 'post',
		handler: UsersController.updateType,
		middlewares: [isAuthenticatedButIgnoreVerified],
	},
	{
		path: '/application',
		method: 'post',
		handler: UsersController.updateApplication,
		middlewares: [isAdmin],
	},
	{
		path: '/location',
		method: 'post',
		handler: UsersController.updateLocation,
		middlewares: [isAuthenticated],
	},
	{
		path: '/admin',
		method: 'get',
		handler: UsersController.getUsersAdmin,
		middlewares: [isAdmin],
	},
	{
		path: '/admin/:id',
		method: 'get',
		handler: UsersController.findUserAdmin,
		middlewares: [isAdmin],
	},
	{
		path: '/',
		method: 'get',
		handler: UsersController.getUsers,
	},
	{
		path: '/:id',
		method: 'get',
		handler: UsersController.findUser,
	},
	{
		path: '/driverAvailability',
		method: 'post',
		handler: UsersController.updateDriverAvailability,
		middlewares: [isAuthenticated],
	},
	{
		path: '/vendor',
		method: 'post',
		handler: UsersController.updateVendor,
		middlewares: [isAuthenticated],
	},
	{
		path: '/savedLocations',
		method: 'post',
		handler: UsersController.updateSavedLocations,
		middlewares: [isAuthenticated],
	},
])
