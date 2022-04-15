import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { UsersController } from '../../controllers/users/users'

export const usersRoutes: Route[] = [
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
		path: '/users/users/drivers/add',
		method: 'post',
		controllers: [
			requireAuthUser,
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
			requireAuthUser,
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
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.removeDriver(req)
				}
			})
		]
	}
]