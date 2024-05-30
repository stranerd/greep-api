import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const walletsRoutes = groupRoutes({ path: '/wallets', tags: ['Wallets'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: WalletsController.get,
	},
	{
		path: '/transfer',
		method: 'post',
		handler: WalletsController.transfer,
	},
	{
		path: '/withdraw',
		method: 'post',
		handler: WalletsController.withdraw,
	},
	{
		path: '/pin/reset/mail',
		method: 'post',
		handler: WalletsController.sendPinResetMail,
	},
	{
		path: '/pin/reset',
		method: 'post',
		handler: WalletsController.resetPin,
	},
	{
		path: '/pin/verify',
		method: 'post',
		handler: WalletsController.verifyPin,
	},
	{
		path: '/pin',
		method: 'post',
		handler: WalletsController.updatePin,
	},
])
