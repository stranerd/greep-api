import { isAdmin, isAuthenticated } from '@application/middlewares'
import { Route, StatusCodes, makeController } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes: Route[] = [
	{
		path: '/users/users/type',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateType(req)
				}
			})
		]
	},
	{
		path: '/users/users/admin',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getUsersAdmin(req)
				}
			})
		]
	},
	{
		path: '/users/users/admin/:id',
		method: 'get',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.findUserAdmin(req)
				}
			})
		]
	},
	{
		path: '/users/users/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getUsers(req)
				}
			})
		]
	},
	{
		path: '/users/users/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.findUser(req)
				}
			})
		]
	},
	{
		path: '/users/users/managers/accept',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.acceptManager(req)
				}
			})
		]
	},
	{
		path: '/users/users/drivers/add',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.addDriver(req)
				}
			})
		]
	},
	{
		path: '/users/users/drivers/update',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateDriverCommission(req)
				}
			})
		]
	},
	{
		path: '/users/users/drivers/remove',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.removeDriver(req)
				}
			})
		]
	}
]