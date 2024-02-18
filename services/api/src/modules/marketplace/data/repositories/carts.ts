import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ClientSession } from 'mongoose'
import { ICartRepository } from '../../domain/irepositories/carts'
import { AddToCartInput, CheckoutCart } from '../../domain/types'
import { CartMapper } from '../mappers/carts'
import { CartFromModel } from '../models/carts'
import { Cart } from '../mongooseModels/carts'
import { Product } from '../mongooseModels/products'

export class CartRepository implements ICartRepository {
	private static instance: CartRepository
	private mapper = new CartMapper()

	static getInstance(): CartRepository {
		if (!CartRepository.instance) CartRepository.instance = new CartRepository()
		return CartRepository.instance
	}

	private async getUserCart(userId: string, session?: ClientSession) {
		const cart = await Cart.findOneAndUpdate(
			{ userId, active: true },
			{ $setOnInsert: { userId, active: true, products: [] } },
			{ upsert: true, new: true, ...(session ? { session } : {}) },
		)
		return cart!
	}

	async getForUser(userId: string) {
		return this.mapper.mapFrom(await this.getUserCart(userId))!
	}

	async add(data: AddToCartInput) {
		let res = null as CartFromModel | null
		await Cart.collection.conn.transaction(async (session) => {
			const cart = await this.getUserCart(data.userId, session)

			const products = structuredClone(cart.products)
			const productIndex = cart.products.findIndex((p) => p.id === data.productId)
			if (data.add) {
				const product = await Product.findById(data.productId)
				if (!product || !product.inStock) throw new Error('product not available')
				if (productIndex !== -1) products[productIndex].quantity += data.quantity
				else products.push({ ...product.price, id: data.productId, quantity: data.quantity })
			} else {
				if (productIndex !== -1) products[productIndex].quantity -= data.quantity
				if (products[productIndex].quantity <= 0) products.splice(productIndex, 1)
			}

			const updatedCart = await Cart.findByIdAndUpdate(cart.id, { $set: products }, { new: true, session })
			res = updatedCart
			return updatedCart
		})
		return this.mapper.mapFrom(res)!
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Cart, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const chat = await Cart.findById(id)
		return this.mapper.mapFrom(chat)
	}

	async checkout(data: CheckoutCart) {
		// TODO: Implement
		console.log('checkout', data)
		if (data) throw new Error('Not implemented')
		return data as unknown as never
	}
}
