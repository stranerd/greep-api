import { isAuthenticated } from '@application/middlewares'
import { CartLinkEntity, CartLinksUseCases, ProductsUseCases } from '@modules/marketplace'
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

const schema = () => ({
	products: Schema.array(
		Schema.object({
			id: Schema.string().min(1),
			quantity: Schema.number().int().gte(1),
		}),
	).min(1),
})

const router = new Router({ path: '/cartLinks', groups: ['Cart Links'] })

router.get<CartLinksGetRouteDef>({ path: '/', key: 'marketplace-cartlinks-get' })(async (req) => {
	const query = req.query
	return await CartLinksUseCases.get(query)
})

router.get<CartLinksFindRouteDef>({ path: '/:id', key: 'marketplace-cartlinks-find' })(async (req) => {
	const cartlink = await CartLinksUseCases.find(req.params.id)
	if (!cartlink) throw new NotFoundError()
	return cartlink
})

router.post<CartLinksCreateRouteDef>({ path: '/', key: 'marketplace-cartlinks-create', middlewares: [isAuthenticated] })(async (req) => {
	const data = validate(schema(), req.body)

	const { results: products } = await ProductsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: data.products.map((p) => p.id) }],
		all: true,
	})
	const productsMap = new Map(products.map((p) => [p.id, p]))

	const vendorId = products.at(0)?.user.id
	if (!vendorId || products.find((p) => p.user.id !== vendorId)) throw new BadRequestError('all products must be from the same vendor')

	return await CartLinksUseCases.create({
		products: data.products
			.map((p) =>
				productsMap.has(p.id)
					? {
							...productsMap.get(p.id)!.price,
							id: p.id,
							quantity: p.quantity,
						}
					: null!,
			)
			.filter(Boolean),
		userId: req.authUser!.id,
		vendorId,
	})
})

router.put<CartLinksUpdateRouteDef>({ path: '/:id', key: 'marketplace-cartlinks-update', middlewares: [isAuthenticated] })(async (req) => {
	const data = validate(schema(), req.body)

	const { results: products } = await ProductsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: data.products.map((p) => p.id) }],
		all: true,
	})
	const productsMap = new Map(products.map((p) => [p.id, p]))

	const vendorId = products.at(0)?.user.id
	if (!vendorId || products.find((p) => p.user.id !== vendorId)) throw new BadRequestError('all products must be from the same vendor')

	const updatedCartLink = await CartLinksUseCases.update({
		id: req.params.id,
		userId: req.authUser!.id,
		data: {
			vendorId,
			products: data.products
				.map((p) =>
					productsMap.has(p.id)
						? {
								...productsMap.get(p.id)!.price,
								id: p.id,
								quantity: p.quantity,
							}
						: null!,
				)
				.filter(Boolean),
		},
	})
	if (updatedCartLink) return updatedCartLink
	throw new NotAuthorizedError()
})

export default router

type CartLinkBody = {
	products: { id: string; quantity: number }[]
}

type CartLinksGetRouteDef = ApiDef<{
	key: 'marketplace-cartlinks-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<CartLinkEntity>
}>

type CartLinksFindRouteDef = ApiDef<{
	key: 'marketplace-cartlinks-find'
	method: 'get'
	params: { id: string }
	response: CartLinkEntity
}>

type CartLinksCreateRouteDef = ApiDef<{
	key: 'marketplace-cartlinks-create'
	method: 'post'
	body: CartLinkBody
	files: { banner: false }
	response: CartLinkEntity
}>

type CartLinksUpdateRouteDef = ApiDef<{
	key: 'marketplace-cartlinks-update'
	method: 'put'
	params: { id: string }
	body: CartLinkBody
	files: { banner?: false }
	response: CartLinkEntity
}>
