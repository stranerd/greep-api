import { isAuthenticated, isVendor } from '@application/middlewares'
import { ProductsUseCases, PromotionEntity, PromotionsUseCases, PromotionType } from '@modules/marketplace'
import { Currencies } from '@modules/payment'
import { StorageUseCases } from '@modules/storage'
import { UserVendorType } from '@modules/users'
import {
	ApiDef,
	Conditions,
	FileSchema,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

const schema = (bannerRequired: boolean) => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	validity: Schema.object({
		from: Schema.time()
			.asStamp()
			.default(() => Date.now()),
		to: Schema.time().asStamp(),
	})
		.custom((val) => val.to > val.from, 'to must be after from')
		.nullable(),
	data: Schema.discriminate((v) => v.type, {
		[PromotionType.freeDelivery]: Schema.object({
			type: Schema.is(PromotionType.freeDelivery as const),
		}),
		[PromotionType.percentageAmountDiscount]: Schema.object({
			type: Schema.is(PromotionType.percentageAmountDiscount as const),
			percentage: Schema.number().gt(0).lte(100),
			currency: Schema.in(Object.values(Currencies)),
			lowerLimit: Schema.number().nullable().default(null),
		}),
		[PromotionType.fixedAmountDiscount]: Schema.object({
			type: Schema.is(PromotionType.fixedAmountDiscount as const),
			amount: Schema.number().gt(0),
			currency: Schema.in(Object.values(Currencies)),
			lowerLimit: Schema.number().nullable().default(null),
		}),
	}),
	banner: Schema.file()
		.image()
		.requiredIf(() => bannerRequired),
	productIds: Schema.array(Schema.string().min(1)).nullable(),
})

const router = new Router({ path: '/promotions', groups: ['Promotions'] })

router.get<PromotionsGetRouteDef>({ path: '/', key: 'marketplace-promotions-get' })(async (req) => {
	const promos = await PromotionsUseCases.get(req.query)
	if (req.query.active) promos.results = promos.results.filter((p) => p.active)
	return promos
})

router.get<PromotionsFindRouteDef>({ path: '/:id', key: 'marketplace-promotions-find' })(async (req) => {
	const promotion = await PromotionsUseCases.find(req.params.id)
	if (!promotion) throw new NotFoundError()
	return promotion
})

router.post<PromotionsCreateRouteDef>({ path: '/', key: 'marketplace-promotions-create', middlewares: [isAuthenticated, isVendor] })(
	async (req) => {
		const data = validate(schema(true), { ...req.body, banner: req.body.banner?.at?.(0) ?? null })

		const banner = await StorageUseCases.upload('marketplace/promotions/banners', data.banner!)

		const products = await ProductsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: data.productIds }],
			all: true,
		})

		return await PromotionsUseCases.create({
			...data,
			createdBy: req.authUser!.id,
			vendorIds: [req.authUser!.id],
			vendorType: [req.authUser!.roles.isVendorFoods ? UserVendorType.foods : UserVendorType.items],
			productIds: products.results.map((p) => p.id),
			banner,
		})
	},
)

router.put<PromotionsUpdateRouteDef>({ path: '/:id', key: 'marketplace-promotions-update', middlewares: [isAuthenticated] })(
	async (req) => {
		const uploadedBanner = req.body.banner?.at?.(0) ?? null
		const changedBanner = !!uploadedBanner

		const { banner: _, ...data } = validate(schema(false), { ...req.body, banner: uploadedBanner })

		const banner = uploadedBanner ? await StorageUseCases.upload('marketplace/promotions/banners', uploadedBanner) : undefined

		const products = await ProductsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: data.productIds }],
			all: true,
		})

		const updatedPromotion = await PromotionsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: {
				...data,
				productIds: products.results.map((p) => p.id),
				...(changedBanner ? { banner } : {}),
			},
		})
		if (updatedPromotion) return updatedPromotion
		throw new NotAuthorizedError()
	},
)

export default router

type PromotionsGetRouteDef = ApiDef<{
	key: 'marketplace-promotions-get'
	method: 'get'
	query: QueryParams & { active?: boolean }
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
	validity: { from: number; to: number } | null
	productIds: string[] | null
}

type PromotionsCreateRouteDef = ApiDef<{
	key: 'marketplace-promotions-create'
	method: 'post'
	body: PromotionBody & { banner: FileSchema }
	response: PromotionEntity
}>

type PromotionsUpdateRouteDef = ApiDef<{
	key: 'marketplace-promotions-update'
	method: 'put'
	params: { id: string }
	body: PromotionBody & { banner?: FileSchema }
	response: PromotionEntity
}>
