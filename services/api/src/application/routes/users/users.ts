import { isAdmin, isAuthenticatedButIgnoreVerified } from '@application/middlewares'
import { Route, StatusCodes, makeController } from 'equipped'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes: Route[] = [
	{
		path: '/users/users/type',
		method: 'post',
		controllers: [
			isAuthenticatedButIgnoreVerified,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateType(req)
				}
			})
		]
	},
	{
		path: '/users/users/application',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateApplication(req)
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
	}
]