import { CartsUseCases, ProductsUseCases } from '@modules/marketplace'
import { NotFoundError, Request, Schema, validate } from 'equipped'

export class CartsController {
	static async get(req: Request) {
		return await CartsUseCases.getForUser(req.authUser!.id)
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

		if (data.add) {
			const product = await ProductsUseCases.find(data.productId)
			if (!product) throw new NotFoundError('product not found')
		}

		return await CartsUseCases.add({ ...data, userId: req.authUser!.id })
	}
}
