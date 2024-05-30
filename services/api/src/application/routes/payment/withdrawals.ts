import { WithdrawalsController } from '@application/controllers/payment/withdrawals'
import { isAuthenticated, isDriver } from '@application/middlewares'
import { groupRoutes } from 'equipped'

export const withdrawalsRoutes = groupRoutes({ path: '/withdrawals', tags: ['Withdrawals'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: WithdrawalsController.get,
	},
	{
		path: '/:id',
		method: 'get',
		handler: WithdrawalsController.find,
	},
	{
		path: '/:id/assignAgent',
		method: 'post',
		handler: WithdrawalsController.assignAgent,
		middlewares: [isDriver],
	},
	{
		path: '/:id/token',
		method: 'get',
		handler: WithdrawalsController.generateToken,
	},
	{
		path: '/:id/complete',
		method: 'post',
		handler: WithdrawalsController.complete,
	},
])
