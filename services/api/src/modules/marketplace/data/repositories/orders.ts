import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IOrderRepository } from '../../domain/irepositories/orders'
import { OrderMapper } from '../mappers/orders'
import { OrderFromModel, OrderToModel } from '../models/orders'
import { Cart } from '../mongooseModels/carts'
import { Order } from '../mongooseModels/orders'
import { Product } from '../mongooseModels/products'

export class OrderRepository implements IOrderRepository {
	private static instance: OrderRepository
	private mapper = new OrderMapper()

	static getInstance(): OrderRepository {
		if (!OrderRepository.instance) OrderRepository.instance = new OrderRepository()
		return OrderRepository.instance
	}

	async checkout(data: OrderToModel) {
		let res = null as OrderFromModel | null
		await Cart.collection.conn.transaction(async (session) => {
			const cart = await Cart.findById(data.cartId, {}, { session })
			if (!cart) throw new Error('cart not found')
			if (!cart.active) throw new Error('cart not active')

			const products = await Product.find({ _id: { $in: cart.products.map((p) => p.id) } }, {}, { session })
			if (products.some((p) => !p.inStock)) throw new Error('some products are not available')

			const filteredProducts = cart.products.filter((p) => products.find((pr) => pr.id === p.id)?.inStock)
			if (!filteredProducts.length) throw new Error('no products available! Reset your cart and continue shopping')

			const totalAmount = filteredProducts.reduce((acc, p) => acc + p.amount * p.quantity, 0)
			const amountToPay = ((100 - data.discount) / 100) * totalAmount
			const currency = products[0].price.currency

			const order = await new Order({
				...data,
				vendorId: cart.vendorId,
				products: filteredProducts,
				price: {
					amount: amountToPay,
					currency,
				},
			}).save({ session })
			await Cart.findByIdAndUpdate(cart.id, { $set: { active: false } }, { session })
			return (res = order)
		})
		return this.mapper.mapFrom(res)!
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Order, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const chat = await Order.findById(id)
		return this.mapper.mapFrom(chat)
	}
}
