import { CartUseCases } from '@modules/cart'
import { Request, Schema, validate } from 'equipped'

export class CartController {
	static async get(req: Request) {
		return CartUseCases.get(req.authUser!.id)
	}
	
	static async create (req: Request) {
		const data = validate({
			files: Schema.array(Schema.file()),
			productId: Schema.string().min(1),
			quantity: Schema.number(),
			userId: Schema.string().min(1),
		}, { files: req.files.files  })

		const cart = await CartUseCases.create(data)
		return cart
	}
}