import { ICartRepository } from '../../domain/i-repositories/cart'
import Cart from '../mongooseModels/cart'
import { ICartToModel } from '../models/cart'

export class CartRepository implements ICartRepository {
	private static instance: CartRepository
	// private mapper = new UserMapper()

	static getInstance(): CartRepository {
		if (!CartRepository.instance) CartRepository.instance = new CartRepository()
		return CartRepository.instance
	}

	async create(cart: ICartToModel, userId: string) {
		//TODO: check if the product id is already in the database, if its there.. add to the quantity...  -> Done
		const foundCart = await Cart.findOne({ productId: cart.productId, userId })

		if (foundCart) {
			const newCart = await foundCart.updateOne(cart, { new: true })
			return newCart
		}

		const newCart = await Cart.create(cart)
		await newCart.save()
		return newCart
	}

	async get(userId: string) {
		return await Cart.find({
			userId,
		})
	}

	async remove(productId: string, userId: string) {
		const foundCart = await Cart.findOne({ productId, userId })
		return await foundCart?.deleteOne()
	}
}
