import { NotFoundError } from 'equipped'
import { ICartRepository } from '../../domain/i-repositories/cart'
import { ICartToModel } from '../models/cart'
import Cart from '../mongooseModels/cart'

export class CartRepository implements ICartRepository {
	private static instance: CartRepository
	// private mapper = new UserMapper()

	static getInstance(): CartRepository {
		if (!CartRepository.instance) CartRepository.instance = new CartRepository()
		return CartRepository.instance
	}

	async create(cart: ICartToModel) {
		//TODO: check if the product id is already in the database, if its there.. add to the quantity...  -> Done
		// not safe enough, when running multple commands like this that affect the db based on a condition, it is safer to run inside a transaction
		// luckily, it is not even needed here, cause mongo provides a way to do upserts
		const { productId, userId } = cart
		const foundCart = await Cart.findOne({ productId, userId })

		if (foundCart) {
			const newCart = await Cart.findByIdAndUpdate(foundCart.id, cart, { new: true })
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
		// why multiple operations when one can do the job, findOneAndDelete
		const foundCart = await Cart.findOne({ productId, userId })
		if (!foundCart) throw new NotFoundError('Cart not found')
		return await foundCart?.deleteOne()
	}
}
