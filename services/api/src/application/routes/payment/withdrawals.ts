import { WithdrawalsController } from '@application/controllers/payment/withdrawals'
import { isAuthenticated, isDriver } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'

export const withdrawalsRoutes = groupRoutes('/withdrawals', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WithdrawalsController.get(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WithdrawalsController.find(req))],
	},
	{
		path: '/:id/assignAgent',
		method: 'post',
		controllers: [isAuthenticated, isDriver, makeController(async (req) => WithdrawalsController.assignAgent(req))],
	},
	{
		path: '/:id/token',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => WithdrawalsController.generateToken(req))],
	},
	{
		path: '/:id/complete',
		method: 'post',
		controllers: [isAuthenticated, makeController(async (req) => WithdrawalsController.complete(req))],
	},
])
