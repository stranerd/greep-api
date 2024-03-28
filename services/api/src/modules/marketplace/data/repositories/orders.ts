import { appInstance } from '@utils/environment'
import { NotAuthorizedError, QueryParams, Random } from 'equipped'
import { OrderEntity } from '../../domain/entities/orders'
import { IOrderRepository } from '../../domain/irepositories/orders'
import { AcceptOrderInput, CheckoutInput, OrderStatus, OrderType } from '../../domain/types'
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

	async create(data: OrderToModel) {
		const order = await new Order({
			...data,
			fee: await OrderEntity.calculateFees(data),
		}).save()
		return this.mapper.mapFrom(order)!
	}

	async checkout(data: CheckoutInput) {
		let res = null as OrderFromModel | null
		await Order.collection.conn.transaction(async (session) => {
			const cart = await Cart.findById(data.cartId, {}, { session })
			if (!cart || cart.userId !== data.userId) throw new Error('cart not found')
			if (!cart.active) throw new Error('cart not active')

			const products = await Product.find({ _id: { $in: cart.products.map((p) => p.id) } }, {}, { session })
			if (products.some((p) => !p.inStock)) throw new Error('some products are not available')

			const filteredProducts = cart.products.filter((p) => products.find((pr) => pr.id === p.id)?.inStock)
			if (!filteredProducts.length) throw new Error('no products available! Reset your cart and continue shopping')

			const orderData: OrderToModel['data'] = {
				type: OrderType.cart,
				cartId: cart.id,
				vendorId: cart.vendorId,
				products: filteredProducts,
			}
			const order = await new Order({
				...data,
				data: orderData,
				fee: await OrderEntity.calculateFees({ ...data, data: orderData }),
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
			{
				_id: id,
				'data.vendorId': vendorId,
				[`status.${OrderStatus.accepted}`]: null,
				[`status.${OrderStatus.rejected}`]: null,
				$or: [{ 'data.type': OrderType.cart, 'data.vendorId': vendorId }, { 'data.type': OrderType.dispatch }],
			},
			{
				$set: {
					[`status.${accepted ? OrderStatus.accepted : OrderStatus.rejected}`]: { at: Date.now(), message },
					...(accepted ? {} : { done: true }),
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
				[`status.${OrderStatus.accepted}`]: { $ne: null },
			},
			{ $set: { driverId, [`status.${OrderStatus.deliveryDriverAssigned}`]: { at: Date.now() } } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async generateToken(id: string, userId: string) {
		const order = this.mapper.mapFrom(await Order.findById(id))
		if (!order || order.userId !== userId) throw new NotAuthorizedError()
		if (order.currentStatus !== OrderStatus.deliveryDriverAssigned) throw new NotAuthorizedError('Order delivery is not in progress')
		const token = Random.number(1e4, 1e5).toString()
		await appInstance.cache.set(`order-delivery-token-${token}`, id, 60 * 3)
		return token
	}

	async complete(id: string, userId: string, token: string) {
		const order = this.mapper.mapFrom(await Order.findById(id))
		if (!order || order.driverId !== userId) throw new NotAuthorizedError()
		if (order.currentStatus !== OrderStatus.deliveryDriverAssigned) throw new NotAuthorizedError('Order delivery is not in progress')
		if (!order.paid) throw new NotAuthorizedError('Order is not paid yet')
		const cachedId = await appInstance.cache.get(`order-delivery-token-${token}`)
		if (cachedId !== id) throw new NotAuthorizedError('invalid token')
		const completed = await Order.findByIdAndUpdate(
			id,
			{ $set: { [`status.${OrderStatus.completed}`]: { at: Date.now() }, done: true } },
			{ new: true },
		)
		return this.mapper.mapFrom(completed)
	}

	async markPaid(id: string, driverId: string | null) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				...(driverId ? { driverId } : {}),
				[`status.${OrderStatus.paid}`]: null,
			},
			{ $set: { [`status.${OrderStatus.paid}`]: { at: Date.now() } } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async cancel(id: string, userId: string) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				userId,
				[`status.${OrderStatus.accepted}`]: null,
			},
			{ $set: { [`status.${OrderStatus.cancelled}`]: { at: Date.now() }, done: true } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}
}
