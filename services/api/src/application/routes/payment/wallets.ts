import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'

export const walletsRoutes: Route[] = [
	{
		path: '/payment/wallets',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/wallets/tranfer',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.transfer(req)
				}
			})
		]
	}
]