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
				{ $setOnInsert: { userId: data.userId, active: true, vendorId: product.user.id, packs: [] } },
				{ upsert: true, new: true, ...(session ? { session } : {}) },
			)

			const length = data.pack >= cart.packs.length ? data.pack + 1 : cart.packs.length
			const packs = Array.from({ ...structuredClone(cart.packs), length }, (val) => val ?? [])
			const productIndex = packs[data.pack].findIndex((p) => p.id === data.productId)
			if (data.add) {
				if (!product.inStock) throw new Error('product not available')
				if (productIndex !== -1) {
					packs[data.pack][productIndex].quantity += data.quantity
					packs[data.pack][productIndex].amount = product.price.amount
				} else packs[data.pack].push({ ...product.price, id: data.productId, quantity: data.quantity })
			} else {
				if (productIndex !== -1) packs[data.pack][productIndex].quantity -= data.quantity
			}
			const filteredPacks = packs.map((pack) => pack.filter((pack) => pack.quantity > 0)).filter((pack) => pack.length > 0)

			const updatedCart = await Cart.findByIdAndUpdate(cart.id, { $set: { packs: filteredPacks } }, { new: true, session })
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

	async clear(id: string, userId: string) {
		const cart = await Cart.findOneAndUpdate({ _id: id, userId }, { $set: { products: [] } }, { new: true })
		return this.mapper.mapFrom(cart)
	}
}
