import { isAuthenticated, isVendor } from '@application/middlewares'
import { TagEntity, TagMeta, TagTypes, TagsUseCases } from '@modules/interactions'
import { ProductEntity, ProductMeta, ProductsUseCases } from '@modules/marketplace'
import { Currencies } from '@modules/payment'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import {
	ApiDef,
	BadRequestError,
	Conditions,
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
	price: Schema.object({
		amount: Schema.number().gt(0),
		currency: Schema.in(Object.values(Currencies)),
	}),
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

router.get<ProductsRecommendedProductsRouteDef>({ path: '/recommendation/products', key: 'marketplace-products-recommended-products' })(
	async (req) => {
		const query: QueryParams = req.query
		query.sort ??= []
		query.sort.unshift({ field: `meta.${ProductMeta.orders}`, desc: true })
		return await ProductsUseCases.get(query)
	},
)

router.get<ProductsRecommendedTagsRouteDef>({ path: '/recommendation/tags', key: 'marketplace-products-recommended-tags' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'type', value: TagTypes.products }]
	query.sort ??= []
	query.sort.unshift({ field: `meta.${TagMeta.orders}`, desc: true })
	query.limit = 10
	return await TagsUseCases.get(query)
})

router.post<ProductsCreateRouteDef>({ path: '/', key: 'marketplace-products-create', middlewares: [isAuthenticated, isVendor] })(
	async (req) => {
		const data = validate(schema(true), { ...req.body, banner: req.files.banner?.at(0) ?? null })

		const { results: tags } = await TagsUseCases.get({
			where: [{ field: 'id', condition: Conditions.in, value: data.tagIds }],
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')
		if (!user.vendor?.location)
			throw new BadRequestError('you must set your vendor location before you can list products on the marketplace')

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
	const uploadedBanner = req.files.banner?.at(0) ?? null
	const changedBanner = !!uploadedBanner

	const { title, description, price, tagIds } = validate(schema(false), { ...req.body, banner: uploadedBanner })

	const { results: tags } = await TagsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: tagIds }],
	})

	const banner = uploadedBanner ? await StorageUseCases.upload('marketplace/banners', uploadedBanner) : undefined

	const updatedProduct = await ProductsUseCases.update({
		id: req.params.id,
		userId: req.authUser!.id,
		data: {
			title,
			description,
			price,
			tagIds: tags.map((t) => t.id),
			...(changedBanner ? { photo: banner } : {}),
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

type ProductsRecommendedProductsRouteDef = ApiDef<{
	key: 'marketplace-products-recommended-products'
	method: 'get'
	query: QueryParams
	response: QueryResults<ProductEntity>
}>

type ProductsRecommendedTagsRouteDef = ApiDef<{
	key: 'marketplace-products-recommended-tags'
	method: 'get'
	query: QueryParams
	response: QueryResults<TagEntity>
}>

type ProductsCreateRouteDef = ApiDef<{
	key: 'marketplace-products-create'
	method: 'post'
	body: {
		title: string
		description: string
		price: { amount: number; currency: Currencies }
		inStock: boolean
		tagIds: string[]
	}
	files: { banner: false }
	response: ProductEntity
}>

type ProductsUpdateRouteDef = ApiDef<{
	key: 'marketplace-products-update'
	method: 'put'
	params: { id: string }
	body: {
		title: string
		description: string
		price: { amount: number; currency: Currencies }
		inStock: boolean
		tagIds: string[]
	}
	files: { banner?: false }
	response: ProductEntity
}>

type ProductsDeleteRouteDef = ApiDef<{
	key: 'marketplace-products-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
