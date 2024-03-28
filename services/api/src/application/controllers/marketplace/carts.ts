import { CartsUseCases } from '@modules/marketplace'
import { NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class CartsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await CartsUseCases.get(query)
	}

	static async find(req: Request) {
		const cart = await CartsUseCases.find(req.params.id)
		if (!cart || cart.userId !== req.authUser!.id) throw new NotFoundError()
		return cart
	}

	static async add(req: Request) {
		const data = validate(
			{
				productId: Schema.string().min(1),
				quantity: Schema.number(),
				add: Schema.boolean(),
			},
			req.body,
		)

		return await CartsUseCases.add({ ...data, userId: req.authUser!.id })
	}

	static async clear(req: Request) {
		const updatedCart = await CartsUseCases.clear({ id: req.params.id, userId: req.authUser!.id })
		if (updatedCart) return updatedCart
		throw new NotAuthorizedError()
	}
}
