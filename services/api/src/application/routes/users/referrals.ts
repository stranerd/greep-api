import { isAuthenticated } from '@application/middlewares'
import { groupRoutes } from 'equipped'
import { ReferralsController } from '../../controllers/users/referrals'

export const referralsRoutes = groupRoutes({ path: '/referrals', groups: ['Referrals'], middlewares: [isAuthenticated] }, [
	{
		path: '/',
		method: 'get',
		handler: ReferralsController.getReferrals,
	},
	{
		path: '/:id',
		method: 'get',
		handler: ReferralsController.findReferral,
	},
])
