import { isAuthenticated, isVendor } from '@application/middlewares'
import { TagEntity, TagTypes, TagsUseCases } from '@modules/interactions'
import { ProductAddOns, ProductEntity, ProductMeta, ProductsUseCases, PromotionsUseCases } from '@modules/marketplace'
import { Currencies } from '@modules/payment'
import { StorageUseCases } from '@modules/storage'
import { UserType, UserVendorType, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { getCoordsHashSlice } from '@utils/types'
import {
	ApiDef,
	AuthRole,
	AuthUser,
	BadRequestError,
	Conditions,
	FileSchema,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	QueryResults,
	QueryWhere,
	Router,
	Schema,
	validate,
} from 'equipped'

const schema = (bannerRequired: boolean, authUser: AuthUser) => ({
	title: Schema.string().min(1),
	description: Schema.string().min(1),
	price: Schema.object({
		amount: Schema.number().gt(0),
		currency: Schema.in(Object.values(Currencies)),
	}),
	data: Schema.discriminate((v) => v.type, {
		[UserVendorType.foods]: Schema.object({
			type: Schema.is(UserVendorType.foods as const),
			prepTimeInMins: Schema.object({
				from: Schema.number().int().gte(0),
				to: Schema.number().int().gte(0),
			}).custom((val) => val.to >= val.from, 'to cannot be less than from'),
		}),
		[UserVendorType.items]: Schema.object({
			type: Schema.is(UserVendorType.items as const),
		}),
	}).custom(
		(v) =>
			authUser.roles.isVendorFoods
				? v.type === UserVendorType.foods
				: authUser.roles.isVendorItems
					? v.type === UserVendorType.items
					: false,
		'invalid data type',
	),
	addOns: Schema.record(
		Schema.object({
			minSelection: Schema.number().int().gte(0).nullable(),
			maxSelection: Schema.number().int().gte(0).nullable(),
			items: Schema.record(
				Schema.object({
					price: Schema.object({
						amount: Schema.number().gt(0),
						currency: Schema.in(Object.values(Currencies)),
					}),
					inStock: Schema.boolean(),
				}),
			),
		}),
	).default(() => ({})),
	inStock: Schema.boolean(),
	tagIds: Schema.array(Schema.string().min(1)),
	banner: Schema.file()
		.image()
		.requiredIf(() => bannerRequired),
})

const router = new Router({ path: '/products', groups: ['Products'] })

router.get<ProductsGetRouteDef>({ path: '/', key: 'marketplace-products-get' })(async (req) => {
	const query = req.query
	query.auth = []
	query.sort ??= []

	if (query.nearby && req.authUser) {
		const user = await UsersUseCases.find(req.authUser.id)
		if (user && user.account.location) {
			const sliced = getCoordsHashSlice(user.account.location.hash, 2500)
			const vendorIds = await appInstance.cache.getOrSet(
				`nearby-vendors-in-${sliced}`,
				async () => {
					const result = await UsersUseCases.get({
						auth: [
							{ field: 'type.type', value: UserType.vendor },
							{ field: `roles.${AuthRole.isVendor}`, value: true },
							{ field: 'dates.deletedAt', value: null },
							{ field: 'type.location.hash', value: new RegExp(`^${sliced}`) },
						],
						all: true,
					})
					return result.results.map((u) => u.id)
				},
				60 * 60,
			)
			query.auth.push({ field: 'user.id', condition: Conditions.in, value: vendorIds })
		}
	}

	if (query.recommended) query.sort.unshift({ field: `meta.${ProductMeta.orders}`, desc: true })

	if (query.quick) {
		const promotions = await PromotionsUseCases.get({ all: true })
		const promoQueries = promotions.results
			.filter((p) => p.active)
			.map((p) => {
				const query: QueryWhere<unknown>[] = []
				if (p.vendorIds?.length) query.push({ field: 'user.id', condition: Conditions.in, value: p.vendorIds })
				if (p.productIds?.length) query.push({ field: 'id', condition: Conditions.in, value: p.productIds })
				if (p.vendorType?.length) query.push({ field: 'data.type', condition: Conditions.in, value: p.vendorType })
				return { condition: QueryKeys.and, value: query }
			})
		if (promoQueries.length) query.auth.push({ condition: QueryKeys.or, value: promoQueries as any })
	}

	const tags: TagEntity[] = []
	if (query.byFoodTagNames && query.byFoodTagNames.length)
		await TagsUseCases.autoCreate({ type: TagTypes.productsFoods, titles: query.byFoodTagNames }).then((res) => tags.push(...res))
	if (query.byItemTagNames && query.byItemTagNames.length)
		await TagsUseCases.autoCreate({ type: TagTypes.productsItems, titles: query.byItemTagNames }).then((res) => tags.push(...res))
	if (tags.length) query.auth.push({ field: 'tagIds', condition: Conditions.in, value: tags.map((t) => t.id) })

	return await ProductsUseCases.get(query)
})

router.get<ProductsFindRouteDef>({ path: '/:id', key: 'marketplace-products-find' })(async (req) => {
	const product = await ProductsUseCases.find(req.params.id)
	if (!product) throw new NotFoundError()
	return product
})

router.post<ProductsCreateRouteDef>({ path: '/', key: 'marketplace-products-create', middlewares: [isAuthenticated, isVendor] })(
	async (req) => {
		const data = validate(schema(true, req.authUser!), { ...req.body, banner: req.body.banner?.at?.(0) ?? null })

		const { results: tags } = await TagsUseCases.get({
			where: [
				{ field: 'id', condition: Conditions.in, value: data.tagIds },
				{ field: 'type', value: req.authUser!.roles.isVendorFoods ? TagTypes.productsFoods : TagTypes.productsItems },
			],
			all: true,
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		const banner = await StorageUseCases.upload('marketplace/products/banners', data.banner!)

		return await ProductsUseCases.create({
			...data,
			tagIds: tags.map((t) => t.id),
			user: user.getEmbedded(),
			banner,
		})
	},
)

router.put<ProductsUpdateRouteDef>({ path: '/:id', key: 'marketplace-products-update', middlewares: [isAuthenticated] })(async (req) => {
	const uploadedBanner = req.body.banner?.at?.(0) ?? null
	const changedBanner = !!uploadedBanner

	const { banner: _, ...data } = validate(schema(false, req.authUser!), {
		...req.body,
		banner: uploadedBanner,
	})

	const { results: tags } = await TagsUseCases.get({
		where: [
			{ field: 'id', condition: Conditions.in, value: data.tagIds },
			{ field: 'type', value: req.authUser!.roles.isVendorFoods ? TagTypes.productsFoods : TagTypes.productsItems },
		],
		all: true,
	})

	const banner = uploadedBanner ? await StorageUseCases.upload('marketplace/products/banners', uploadedBanner) : undefined

	const updatedProduct = await ProductsUseCases.update({
		id: req.params.id,
		userId: req.authUser!.id,
		data: {
			...data,
			tagIds: tags.map((t) => t.id),
			...(changedBanner ? { banner } : {}),
		},
	})
	if (updatedProduct) return updatedProduct
	throw new NotAuthorizedError()
})

router.delete<ProductsDeleteRouteDef>({ path: '/:id', key: 'marketplace-products-delete', middlewares: [isAuthenticated] })(async (req) => {
	const deleted = await ProductsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
	if (deleted) return deleted
	throw new NotAuthorizedError()
})

export default router

type ProductsGetRouteDef = ApiDef<{
	key: 'marketplace-products-get'
	method: 'get'
	query: QueryParams & { nearby?: boolean; byFoodTagNames?: string[]; byItemTagNames?: string[]; recommended?: boolean; quick?: boolean }
	response: QueryResults<ProductEntity>
}>

type ProductsFindRouteDef = ApiDef<{
	key: 'marketplace-products-find'
	method: 'get'
	params: { id: string }
	response: ProductEntity
}>

type ProductBody = {
	title: string
	description: string
	data: ProductEntity['data']
	price: { amount: number; currency: Currencies }
	inStock: boolean
	tagIds: string[]
	addOns: ProductAddOns
}

type ProductsCreateRouteDef = ApiDef<{
	key: 'marketplace-products-create'
	method: 'post'
	body: ProductBody & { banner: FileSchema }
	response: ProductEntity
}>

type ProductsUpdateRouteDef = ApiDef<{
	key: 'marketplace-products-update'
	method: 'put'
	params: { id: string }
	body: ProductBody & { banner?: FileSchema }
	response: ProductEntity
}>

type ProductsDeleteRouteDef = ApiDef<{
	key: 'marketplace-products-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
