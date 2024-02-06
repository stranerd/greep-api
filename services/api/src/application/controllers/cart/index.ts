import { CartUseCases } from '@modules/marketplace'
import { Request, Schema, validate } from 'equipped'

export class CartController {
	static async get(req: Request) {
		return CartUseCases.get(req.authUser!.id)
	}

	static async create(req: Request) {
		const data = validate(
			{
				productId: Schema.string().min(1),
				quantity: Schema.number(),
			},
			{ ...req.body },
		)

		const cart = await CartUseCases.create({ ...data, userId: req.authUser?.id! })
		return cart
	}

	static async remove(req: Request) {
		const data = validate(
			{
				productId: Schema.string().min(1),
			},
			{ ...req.body },
		)

		const cart = await CartUseCases.remove(data.productId, req.authUser?.id!)
		return cart
	}
}