import { makeController, requireAuthUser, Route, StatusCodes } from '@stranerd/api-commons'
import { ReferralsController } from '../../controllers/users/referrals'

export const referralsRoutes: Route[] = [
	{
		path: '/users/referrals/',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReferralsController.getReferrals(req)
				}
			})
		]
	},
	{
		path: '/users/referrals/:id',
		method: 'get',
		controllers: [
			requireAuthUser,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ReferralsController.findReferral(req)
				}
			})
		]
	}
]