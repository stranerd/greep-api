import { MethodsController } from '@application/controllers/payment/methods'
import { isAuthenticated } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'

export const methodsRoutes: Route[] = [
	{
		path: '/payment/methods',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.find(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/:id/primary',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.makePrimary(req)
				}
			})
		]
	},
	{
		path: '/payment/methods/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await MethodsController.delete(req)
				}
			})
		]
	}
]