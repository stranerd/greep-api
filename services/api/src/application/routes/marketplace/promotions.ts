import { isAuthenticated, isVendor } from '@application/middlewares'
import { PromotionEntity, PromotionsUseCases, PromotionType } from '@modules/marketplace'
import { Currencies } from '@modules/payment'
import { UserVendorType } from '@modules/users'
import { ApiDef, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const schema = () => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	active: Schema.boolean().default(true),
	data: Schema.discriminate((v) => v.type, {
		[PromotionType.freeDelivery]: Schema.object({
			type: Schema.is(PromotionType.freeDelivery as const),
		}),
		[PromotionType.percentageAmountDiscount]: Schema.object({
			type: Schema.is(PromotionType.percentageAmountDiscount as const),
			percentage: Schema.number().gt(0).lte(100),
		}),
		[PromotionType.fixedAmountDiscount]: Schema.object({
			type: Schema.is(PromotionType.fixedAmountDiscount as const),
			amount: Schema.number().gt(0),
			currency: Schema.in(Object.values(Currencies)),
			lowerLimit: Schema.number().nullable().default(null),
		}),
	}),
})

const router = new Router({ path: '/promotions', groups: ['Promotions'] })

router.get<PromotionsGetRouteDef>({ path: '/', key: 'marketplace-promotions-get' })(async (req) => await PromotionsUseCases.get(req.query))

router.get<PromotionsFindRouteDef>({ path: '/:id', key: 'marketplace-promotions-find' })(async (req) => {
	const promotion = await PromotionsUseCases.find(req.params.id)
	if (!promotion) throw new NotFoundError()
	return promotion
})

router.post<PromotionsCreateRouteDef>({ path: '/', key: 'marketplace-promotions-create', middlewares: [isAuthenticated, isVendor] })(
	async (req) => {
		const data = validate(schema(), req.body)

		return await PromotionsUseCases.create({
			...data,
			createdBy: req.authUser!.id,
			vendorIds: [req.authUser!.id],
			vendorType: [req.authUser!.roles.isVendorFoods ? UserVendorType.foods : UserVendorType.items],
		})
	},
)

router.put<PromotionsUpdateRouteDef>({ path: '/:id', key: 'marketplace-promotions-update', middlewares: [isAuthenticated] })(
	async (req) => {
		const data = validate(schema(), req.body)

		const updatedPromotion = await PromotionsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data,
		})
		if (updatedPromotion) return updatedPromotion
		throw new NotAuthorizedError()
	},
)

export default router

type PromotionsGetRouteDef = ApiDef<{
	key: 'marketplace-promotions-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<PromotionEntity>
}>

type PromotionsFindRouteDef = ApiDef<{
	key: 'marketplace-promotions-find'
	method: 'get'
	params: { id: string }
	response: PromotionEntity
}>

type PromotionBody = {
	title: string
	description: string
	data: PromotionEntity['data']
	active: boolean
}

type PromotionsCreateRouteDef = ApiDef<{
	key: 'marketplace-promotions-create'
	method: 'post'
	body: PromotionBody
	response: PromotionEntity
}>

type PromotionsUpdateRouteDef = ApiDef<{
	key: 'marketplace-promotions-update'
	method: 'put'
	params: { id: string }
	body: PromotionBody
	response: PromotionEntity
}>
