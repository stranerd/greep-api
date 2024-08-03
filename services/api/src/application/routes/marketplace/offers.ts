import { isAuthenticated } from '@application/middlewares'
import { Offer, offers } from '@modules/marketplace'
import { ApiDef, Router } from 'equipped'

const router = new Router({ path: '/offers', groups: ['Offers'], middlewares: [isAuthenticated] })

router.get<OffersGetRouteDef>({ path: '/', key: 'marketplace-offers-get' })(() => offers)

export default router

type OffersGetRouteDef = ApiDef<{
	key: 'marketplace-offers-get'
	method: 'get'
	response: Offer[]
}>
