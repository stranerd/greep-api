import { isAuthenticated, isVendor } from '@application/middlewares'
import { TagEntity, TagMeta, TagTypes, TagsUseCases } from '@modules/interactions'
import { ProductEntity, ProductMeta, ProductsUseCases } from '@modules/marketplace'
import { Currencies } from '@modules/payment'
import { StorageUseCases } from '@modules/storage'
import { UserVendorType, UsersUseCases } from '@modules/users'
import {
	ApiDef,
	AuthUser,
	BadRequestError,
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
	inStock: Schema.boolean(),
	tagIds: Schema.array(Schema.string().min(1)),
	banner: Schema.file()
		.image()
		.requiredIf(() => bannerRequired),
})

const router = new Router({ path: '/products', groups: ['Products'] })

router.get<ProductsGetRouteDef>({ path: '/', key: 'marketplace-products-get' })(async (req) => {
	const query = req.query
	return await ProductsUseCases.get(query)
})

router.get<ProductsFindRouteDef>({ path: '/:id', key: 'marketplace-products-find' })(async (req) => {
	const product = await ProductsUseCases.find(req.params.id)
	if (!product) throw new NotFoundError()
	return product
})

router.get<ProductsRecommendedProductsItemsRouteDef>({
	path: '/recommendation/products/items',
	key: 'marketplace-products-recommended-products-items',
})(async (req) => {
	const query: QueryParams = req.query
	query.sort ??= []
	query.sort.unshift({ field: `meta.${ProductMeta.orders}`, desc: true })
	query.auth = [{ field: 'data.type', value: UserVendorType.items }]
	return await ProductsUseCases.get(query)
})

router.get<ProductsRecommendedProductsFoodsRouteDef>({
	path: '/recommendation/products/foods',
	key: 'marketplace-products-recommended-products-foods',
})(async (req) => {
	const query: QueryParams = req.query
	query.sort ??= []
	query.sort.unshift({ field: `meta.${ProductMeta.orders}`, desc: true })
	query.auth = [{ field: 'data.type', value: UserVendorType.foods }]
	return await ProductsUseCases.get(query)
})

router.get<ProductsRecommendedTagsItemsRouteDef>({
	path: '/recommendation/tags/items',
	key: 'marketplace-products-recommended-tags-items',
})(async (req) => {
	const query = req.query
	query.auth = [{ field: 'type', value: TagTypes.productsItems }]
	query.sort ??= []
	query.sort.unshift({ field: `meta.${TagMeta.orders}`, desc: true })
	query.limit = 10
	return await TagsUseCases.get(query)
})

router.get<ProductsRecommendedTagsFoodsRouteDef>({
	path: '/recommendation/tags/foods',
	key: 'marketplace-products-recommended-tags-foods',
})(async (req) => {
	const query = req.query
	query.auth = [{ field: 'type', value: TagTypes.productsFoods }]
	query.sort ??= []
	query.sort.unshift({ field: `meta.${TagMeta.orders}`, desc: true })
	query.limit = 10
	return await TagsUseCases.get(query)
})

router.post<ProductsCreateRouteDef>({ path: '/', key: 'marketplace-products-create', middlewares: [isAuthenticated, isVendor] })(
	async (req) => {
		const data = validate(
			{ ...schema(true, req.authUser!), addOnId: Schema.string().nullable() },
			{ ...req.body, banner: req.body.banner?.at(0) ?? null },
		)

		const { results: tags } = await TagsUseCases.get({
			where: [
				{ field: 'id', condition: Conditions.in, value: data.tagIds },
				{ field: 'type', value: req.authUser!.roles.isVendorFoods ? TagTypes.productsFoods : TagTypes.productsItems },
			],
			all: true,
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')

		if (data.addOnId) {
			const product = await ProductsUseCases.find(data.addOnId)
			if (!product || product.user.id !== user.id || product.data.type !== data.data.type) throw new BadRequestError('invalid add-on')
		}

		const banner = await StorageUseCases.upload('marketplace/banners', data.banner!)

		return await ProductsUseCases.create({
			...data,
			tagIds: tags.map((t) => t.id),
			user: user.getEmbedded(),
			banner,
		})
	},
)

router.put<ProductsUpdateRouteDef>({ path: '/:id', key: 'marketplace-products-update', middlewares: [isAuthenticated] })(async (req) => {
	const uploadedBanner = req.body.banner?.at(0) ?? null
	const changedBanner = !!uploadedBanner

	const { title, description, price, tagIds, data } = validate(schema(false, req.authUser!), { ...req.body, banner: uploadedBanner })

	const { results: tags } = await TagsUseCases.get({
		where: [
			{ field: 'id', condition: Conditions.in, value: tagIds },
			{ field: 'type', value: req.authUser!.roles.isVendorFoods ? TagTypes.productsFoods : TagTypes.productsItems },
		],
		all: true,
	})

	const banner = uploadedBanner ? await StorageUseCases.upload('marketplace/banners', uploadedBanner) : undefined

	const updatedProduct = await ProductsUseCases.update({
		id: req.params.id,
		userId: req.authUser!.id,
		data: {
			title,
			description,
			price,
			data,
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
	query: QueryParams
	response: QueryResults<ProductEntity>
}>

type ProductsFindRouteDef = ApiDef<{
	key: 'marketplace-products-find'
	method: 'get'
	params: { id: string }
	response: ProductEntity
}>

type ProductsRecommendedProductsItemsRouteDef = ApiDef<{
	key: 'marketplace-products-recommended-products-items'
	method: 'get'
	query: QueryParams
	response: QueryResults<ProductEntity>
}>

type ProductsRecommendedProductsFoodsRouteDef = ApiDef<{
	key: 'marketplace-products-recommended-products-foods'
	method: 'get'
	query: QueryParams
	response: QueryResults<ProductEntity>
}>

type ProductsRecommendedTagsItemsRouteDef = ApiDef<{
	key: 'marketplace-products-recommended-tags-items'
	method: 'get'
	query: QueryParams
	response: QueryResults<TagEntity>
}>

type ProductsRecommendedTagsFoodsRouteDef = ApiDef<{
	key: 'marketplace-products-recommended-tags-foods'
	method: 'get'
	query: QueryParams
	response: QueryResults<TagEntity>
}>

type ProductBody = {
	title: string
	description: string
	data: { type: UserVendorType }
	price: { amount: number; currency: Currencies }
	inStock: boolean
	tagIds: string[]
	banner: FileSchema
}

type ProductsCreateRouteDef = ApiDef<{
	key: 'marketplace-products-create'
	method: 'post'
	body: ProductBody & { addOnId: string | null }
	response: ProductEntity
}>

type ProductsUpdateRouteDef = ApiDef<{
	key: 'marketplace-products-update'
	method: 'put'
	params: { id: string }
	body: ProductBody
	response: ProductEntity
}>

type ProductsDeleteRouteDef = ApiDef<{
	key: 'marketplace-products-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
