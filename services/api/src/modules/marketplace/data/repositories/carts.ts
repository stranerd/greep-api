import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ICartRepository } from '../../domain/irepositories/carts'
import { AddToCartInput } from '../../domain/types'
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

	async add(data: AddToCartInput) {
		let res = null as CartFromModel | null
		await Cart.collection.conn.transaction(async (session) => {
			const product = await Product.findById(data.productId)
			if (!product) throw new Error('product not found')
			const cart = await Cart.findOneAndUpdate(
				{ userId: data.userId, active: true, vendorId: product.user.id },
				{ $setOnInsert: { userId: data.userId, active: true, vendorId: product.user.id, products: [] } },
				{ upsert: true, new: true, ...(session ? { session } : {}) },
			)

			const products = structuredClone(cart.products)
			const productIndex = cart.products.findIndex((p) => p.id === data.productId)
			if (data.add) {
				if (!product.inStock) throw new Error('product not available')
				if (productIndex !== -1) {
					products[productIndex].quantity += data.quantity
					products[productIndex].amount = product.price.amount
				} else products.push({ ...product.price, id: data.productId, quantity: data.quantity })
			} else {
				if (productIndex !== -1) products[productIndex].quantity -= data.quantity
			}
			const filteredProducts = products.filter((p) => p.quantity > 0)

			const updatedCart = await Cart.findByIdAndUpdate(cart.id, { $set: { products: filteredProducts } }, { new: true, session })
			return (res = updatedCart)
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
}
