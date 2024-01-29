import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const walletsRoutes = groupRoutes('/wallets', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WalletsController.get(req),
			})),
		],
	},
	{
		path: '/transfer',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WalletsController.transfer(req),
			})),
		],
	},
	{
		path: '/withdraw',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WalletsController.withdraw(req),
			})),
		],
	},
	{
		path: '/pin/reset/mail',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WalletsController.sendPinResetMail(req),
			})),
		],
	},
	{
		path: '/pin/reset',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WalletsController.resetPin(req),
			})),
		],
	},
	{
		path: '/pin',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WalletsController.updatePin(req),
			})),
		],
	},
])
