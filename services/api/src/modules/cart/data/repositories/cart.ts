import { ICartRepository } from '../../domain/i-repositories/cart'
import Cart from '../models/cart'
import { ICartToModel } from '../types'


export class CartRepository implements ICartRepository {
	private static instance: CartRepository
	// private mapper = new UserMapper()

	static getInstance (): CartRepository {
		if (!CartRepository.instance) CartRepository.instance = new CartRepository()
		return CartRepository.instance
	}

	async create(cart: ICartToModel) {
		//TODO: check if the product id is already in the database, if its there.. add to the quantity... 
		const newCategory = await Cart.create(cart)
		await newCategory.save()
		return newCategory
	}

	async get(userId: string) {
		return await Cart.find({
			userId
		})
	}
}