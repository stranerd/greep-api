import { isAuthenticated } from '@application/middlewares'
import { groupRoutes, makeController } from 'equipped'
import { ReferralsController } from '../../controllers/users/referrals'

export const referralsRoutes = groupRoutes('/referrals', [
	{
		path: '/',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ReferralsController.getReferrals(req))],
	},
	{
		path: '/:id',
		method: 'get',
		controllers: [isAuthenticated, makeController(async (req) => ReferralsController.findReferral(req))],
	},
])
