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
			if (data.add && !product.inStock) throw new Error('product not available')
			const vendorId = product.user.id
			const cart = await Cart.findOneAndUpdate(
				{ userId: data.userId, active: true, vendorId },
				{ $setOnInsert: { userId: data.userId, active: true, vendorId, vendorType: product.data.type, packs: [] } },
				{ upsert: true, new: true, ...(session ? { session } : {}) },
			)

			const length = data.pack >= cart.packs.length ? data.pack + 1 : cart.packs.length
			const cloned: typeof cart.packs = JSON.parse(JSON.stringify(cart.packs))
			const packs = Array.from({ ...cloned, length }, (val) => val ?? [])

			const index = packs[data.pack].findIndex((p) => p.id === data.productId)

			if (data.addOn) {
				const addOn = data.addOn
				if (index < 0) throw new Error('base item not in cart')
				const addOnIndex = packs[data.pack][index].addOns.findIndex(
					(p) => p.groupName === addOn.groupName && p.itemName === addOn.itemName,
				)
				if (data.add) {
					if (addOnIndex !== -1) {
						packs[data.pack][index].addOns[addOnIndex].quantity += data.quantity
						packs[data.pack][index].addOns[addOnIndex].price.amount = product.price.amount
					} else packs[data.pack][index].addOns.push({ ...addOn, price: product.price, quantity: data.quantity })
				} else {
					if (addOnIndex !== -1) packs[data.pack][index].addOns[addOnIndex].quantity -= data.quantity
				}
			} else {
				if (data.add) {
					if (index !== -1) {
						packs[data.pack][index].quantity += data.quantity
						packs[data.pack][index].price.amount = product.price.amount
					} else packs[data.pack].push({ id: data.productId, price: product.price, quantity: data.quantity, addOns: [] })
				} else {
					if (index !== -1) packs[data.pack][index].quantity -= data.quantity
				}
			}
			const filteredPacks = packs
				.map((pack) =>
					pack
						.map((item) => ({
							...item,
							addOns: item.addOns.filter((addOn) => addOn.quantity > 0),
						}))
						.filter((item) => item.quantity > 0),
				)
				.filter((pack) => pack.length > 0)

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
		const cart = await Cart.findOneAndUpdate({ _id: id, userId }, { $set: { packs: [] } }, { new: true })
		return this.mapper.mapFrom(cart)
	}
}
