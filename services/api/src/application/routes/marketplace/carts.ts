import { isAuthenticated } from '@application/middlewares'
import { AddToCartInput, CartEntity, CartsUseCases, mergeCartsData } from '@modules/marketplace'
import { ApiDef, NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/carts', groups: ['Carts'], middlewares: [isAuthenticated] })

router.get<CartsGetRouteDef>({ path: '/', key: 'marketplace-carts-get' })(async (req) => {
	const query = req.query
	query.authType = QueryKeys.and
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	const result = await CartsUseCases.get(query)
	return {
		...result,
		results: await mergeCartsData(result.results),
	}
})

router.get<CartsFindRouteDef>({ path: '/:id', key: 'marketplace-carts-find' })(async (req) => {
	const cart = await CartsUseCases.find(req.params.id)
	if (!cart || cart.userId !== req.authUser!.id) throw new NotFoundError()
	return await mergeCartsData([cart]).then((res) => res[0])
})

router.post<CartsAddRouteDef>({ path: '/', key: 'marketplace-carts-add' })(async (req) => {
	const data = validate(
		{
			productId: Schema.string().min(1),
			quantity: Schema.number(),
			pack: Schema.number().int().gte(0),
			addOn: Schema.object({
				groupName: Schema.string().min(1),
				itemName: Schema.string().min(1),
			}).nullable(),
			add: Schema.boolean(),
		},
		req.body,
	)

	const cart = await CartsUseCases.add({ ...data, userId: req.authUser!.id })
	return await mergeCartsData([cart]).then((res) => res[0])
})

router.post<CartsClearRouteDef>({ path: '/:id/clear', key: 'marketplace-carts-clear' })(async (req) => {
	const updatedCart = await CartsUseCases.clear({ id: req.params.id, userId: req.authUser!.id })
	if (updatedCart) return await mergeCartsData([updatedCart]).then((res) => res[0])
	throw new NotAuthorizedError()
})

export default router

type CartsGetRouteDef = ApiDef<{
	key: 'marketplace-carts-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<CartEntity>
}>

type CartsFindRouteDef = ApiDef<{
	key: 'marketplace-carts-find'
	method: 'get'
	params: { id: string }
	response: CartEntity
}>

type CartsAddRouteDef = ApiDef<{
	key: 'marketplace-carts-add'
	method: 'post'
	body: AddToCartInput
	response: CartEntity
}>

type CartsClearRouteDef = ApiDef<{
	key: 'marketplace-carts-clear'
	method: 'post'
	params: { id: string }
	response: CartEntity
}>
