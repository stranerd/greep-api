import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const walletsRoutes = groupRoutes('/wallets', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.get(req))],
	},
	{
		path: '/transfer',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.transfer(req))],
	},
	{
		path: '/withdraw',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.withdraw(req))],
	},
	{
		path: '/pin/reset/mail',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.sendPinResetMail(req))],
	},
	{
		path: '/pin/reset',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.resetPin(req))],
	},
	{
		path: '/pin',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WalletsController.updatePin(req))],
	},
])
