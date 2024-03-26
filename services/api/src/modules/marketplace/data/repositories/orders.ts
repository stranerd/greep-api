import { appInstance } from '@utils/environment'
import { NotAuthorizedError, QueryParams, Random } from 'equipped'
import { IOrderRepository } from '../../domain/irepositories/orders'
import { AcceptOrderInput, CheckoutInput, OrderPayment, OrderStatus, OrderType } from '../../domain/types'
import { OrderMapper } from '../mappers/orders'
import { OrderFromModel } from '../models/orders'
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

	async checkout(data: CheckoutInput) {
		let res = null as OrderFromModel | null
		await Cart.collection.conn.transaction(async (session) => {
			const cart = await Cart.findById(data.cartId, {}, { session })
			if (!cart || cart.userId !== data.userId) throw new Error('cart not found')
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
				data: {
					type: OrderType.cart,
					cartId: cart.id,
					vendorId: cart.vendorId,
					products: filteredProducts,
				},
				status: data.payment === OrderPayment.cash ? OrderStatus.paid : OrderStatus.pendingPayment,
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

	async accept({ id, userId: vendorId, accepted, message }: AcceptOrderInput) {
		const order = await Order.findOneAndUpdate(
			{ _id: id, 'data.vendorId': vendorId, accepted: null },
			{
				$set: {
					accepted: { is: accepted, at: Date.now(), message },
					status: accepted ? OrderStatus.accepted : OrderStatus.rejected,
				},
			},
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async assignDriver(id: string, driverId: string) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				driverId: null,
				status: OrderStatus.accepted,
			},
			{ $set: { driverId, status: OrderStatus.deliveryDriverAssigned } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async generateToken(id: string, userId: string) {
		const order = await Order.findById(id)
		if (!order || order.userId !== userId) throw new NotAuthorizedError()
		if (order.status !== OrderStatus.deliveryDriverAssigned) throw new NotAuthorizedError('Order delivery is not in progress')
		const token = Random.string(12)
		await appInstance.cache.set(`order-delivery-token-${token}`, id, 60 * 3)
		return token
	}

	async complete(id: string, userId: string, token: string) {
		const order = await Order.findById(id)
		if (!order || order.driverId !== userId) throw new NotAuthorizedError()
		if (order.status !== OrderStatus.deliveryDriverAssigned) throw new NotAuthorizedError('Order delivery is not in progress')
		const cachedId = await appInstance.cache.get(`order-delivery-token-${token}`)
		if (cachedId !== id) throw new NotAuthorizedError('invalid token')
		const completed = await Order.findByIdAndUpdate(id, { $set: { status: OrderStatus.completed } }, { new: true })
		return this.mapper.mapFrom(completed)
	}

	async markPaid(id: string) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				status: OrderStatus.pendingPayment,
			},
			{ $set: { status: OrderStatus.paid } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}
}
