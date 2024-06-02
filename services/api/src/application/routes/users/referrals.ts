import { isAuthenticated } from '@application/middlewares'
import { ReferralEntity, ReferralsUseCases } from '@modules/users'
import { ApiDef, NotFoundError, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/referrals', groups: ['Referrals'], middlewares: [isAuthenticated] })

router.get<ReferralsGetRouteDef>({ path: '/', key: 'users-referrals-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await ReferralsUseCases.get(query)
})

router.get<ReferralsFindRouteDef>({ path: '/:id', key: 'users-referrals-find' })(async (req) => {
	const referral = await ReferralsUseCases.find(req.params.id)
	if (!referral || referral.userId !== req.authUser!.id) throw new NotFoundError()
	return referral
})

export default router

type ReferralsGetRouteDef = ApiDef<{
	key: 'users-referrals-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ReferralEntity>
}>

type ReferralsFindRouteDef = ApiDef<{
	key: 'users-referrals-find'
	method: 'get'
	params: { id: string }
	response: ReferralEntity
}>
