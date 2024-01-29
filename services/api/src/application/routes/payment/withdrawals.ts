import { WithdrawalsController } from '@application/controllers/payment/withdrawals'
import { isAuthenticated, isDriver } from '@application/middlewares'
import { groupRoutes, makeController, StatusCodes } from 'equipped'

export const withdrawalsRoutes = groupRoutes('/withdrawals', [
	{
		path: '/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WithdrawalsController.get(req),
			})),
		],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WithdrawalsController.find(req),
			})),
		],
	},
	{
		path: '/:id/assignAgent',
		method: 'post',
		controllers: [
			isAuthenticated,
			isDriver,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WithdrawalsController.assignAgent(req),
			})),
		],
	},
	{
		path: '/:id/token',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WithdrawalsController.generateToken(req),
			})),
		],
	},
	{
		path: '/:id/complete',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => ({
				status: StatusCodes.Ok,
				result: await WithdrawalsController.complete(req),
			})),
		],
	},
])
