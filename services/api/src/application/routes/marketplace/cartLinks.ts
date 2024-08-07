import { isAuthenticated } from '@application/middlewares'
import {
	CartLinkEntity,
	CartLinksUseCases,
	CartProductItem,
	mergeCartLinksData,
	ProductsUseCases,
	resolvePacks,
} from '@modules/marketplace'
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
	packs: Schema.array(
		Schema.array(
			Schema.object({
				id: Schema.string().min(1),
				quantity: Schema.number().int().gte(1),
				addOns: Schema.array(
					Schema.object({
						itemName: Schema.string().min(1),
						groupName: Schema.string().min(1),
						quantity: Schema.number().int().gte(1),
					}),
				),
			}),
		).min(1),
	).min(1),
})

const verifyPacks = async (packs: CartLinkBody['packs']) => {
	const resolved = resolvePacks(packs)
	const { results: products } = await ProductsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: resolved.map((p) => p.id) }],
		all: true,
	})
	const productsMap = new Map(products.map((p) => [p.id, p]))

	const vendorId = products.at(0)?.user.id
	const vendorType = products.at(0)?.data.type
	if (!vendorId || !vendorType || products.find((p) => p.user.id !== vendorId || p.data.type !== vendorType))
		throw new BadRequestError('all products must be from the same vendor')

	const verified = packs.map((pack) =>
		pack
			.filter((p) => productsMap.has(p.id))
			.map((p) => {
				const product = productsMap.get(p.id)!
				return {
					...p,
					price: product.price,
					addOns: p.addOns
						.filter((a) => product.getAddOn(a.groupName, a.itemName))
						.map((a) => ({
							...a,
							price: product.getAddOn(a.groupName, a.itemName)!.price,
						})),
				}
			}),
	)

	return { vendorId, vendorType, packs: verified }
}

const router = new Router({ path: '/cartLinks', groups: ['Cart Links'] })

router.get<CartLinksGetRouteDef>({ path: '/', key: 'marketplace-cartlinks-get' })(async (req) => {
	const query = req.query
	const result = await CartLinksUseCases.get(query)
	return {
		...result,
		results: await mergeCartLinksData(result.results),
	}
})

router.get<CartLinksFindRouteDef>({ path: '/:id', key: 'marketplace-cartlinks-find' })(async (req) => {
	const cartLink = await CartLinksUseCases.find(req.params.id)
	if (!cartLink) throw new NotFoundError()
	return await mergeCartLinksData([cartLink]).then((res) => res[0])
})

router.post<CartLinksCreateRouteDef>({ path: '/', key: 'marketplace-cartlinks-create', middlewares: [isAuthenticated] })(async (req) => {
	const data = validate(schema(), req.body)
	const verified = await verifyPacks(data.packs)
	const cartLink = await CartLinksUseCases.create({ ...verified, userId: req.authUser!.id })
	return await mergeCartLinksData([cartLink]).then((res) => res[0])
})

router.put<CartLinksUpdateRouteDef>({ path: '/:id', key: 'marketplace-cartlinks-update', middlewares: [isAuthenticated] })(async (req) => {
	const data = validate(schema(), req.body)
	const verified = await verifyPacks(data.packs)
	const updatedCartLink = await CartLinksUseCases.update({
		id: req.params.id,
		userId: req.authUser!.id,
		data: verified,
	})
	if (updatedCartLink) return await mergeCartLinksData([updatedCartLink]).then((res) => res[0])
	throw new NotAuthorizedError()
})

export default router

type Item = Omit<CartProductItem, 'price' | 'addOns'> & { addOns: Omit<CartProductItem['addOns'][number], 'price'>[] }
type CartLinkBody = {
	packs: Item[][]
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
	response: CartLinkEntity
}>

type CartLinksUpdateRouteDef = ApiDef<{
	key: 'marketplace-cartlinks-update'
	method: 'put'
	params: { id: string }
	body: CartLinkBody
	response: CartLinkEntity
}>
