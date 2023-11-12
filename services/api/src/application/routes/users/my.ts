import { isAuthenticated } from '@application/middlewares'
import { StatusCodes, groupRoutes, makeController } from 'equipped'
import { MyController } from '../../controllers/users/my'

export const myRoutes = groupRoutes('/my', [
	{
		path: '/quickSend',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyController.quickSend(req)
				}
			})
		]
	},
	{
		path: '/drivers',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MyController.drivers(req)
				}
			})
		]
	}
])