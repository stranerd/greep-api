import { appInstance } from '@utils/environment'
import { NotAuthorizedError, QueryParams, Random } from 'equipped'
import { OrderEntity } from '../../domain/entities/orders'
import { IOrderRepository } from '../../domain/irepositories/orders'
import { AcceptOrderInput, CheckoutInput, OrderData, OrderStatus, OrderType } from '../../domain/types'
import { resolvePacks } from '../../utils/carts'
import { OrderMapper } from '../mappers/orders'
import { ProductMapper } from '../mappers/products'
import { OrderFromModel, OrderToModel } from '../models/orders'
import { CartLink } from '../mongooseModels/cartLinks'
import { Cart } from '../mongooseModels/carts'
import { Order } from '../mongooseModels/orders'
import { Product } from '../mongooseModels/products'

export class OrderRepository implements IOrderRepository {
	private static instance: OrderRepository
	private mapper = new OrderMapper()
	private productMapper = new ProductMapper()

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

	private async resolve(data: OrderData, session: any): Promise<OrderData> {
		if (!('packs' in data)) return data
		const resolved = resolvePacks(data.packs)
		const products = (await Product.find({ _id: { $in: resolved.map((item) => item.id) } }, {}, { session })).map(
			(product) => this.productMapper.mapFrom(product)!,
		)
		const productsMap = new Map(products.map((p) => [p.id, p]))
		resolved.forEach((p) => {
			const product = productsMap.get(p.id)
			if (!product) throw new Error('some products not found')
			if (!product || !product.inStock) throw new Error('some products are not available')
			Object.values(p.addOns).forEach((a) => {
				const addOn = product.getAddOn(a.groupName, a.itemName)
				if (!addOn || !addOn.inStock) throw new Error('some addOns are not available')
			})
		})
		return data
	}

	private async getOrderData(data: CheckoutInput, session): Promise<OrderData> {
		if ('cartId' in data) {
			const cart = await Cart.findById(data.cartId, {}, { session })
			if (!cart || cart.userId !== data.userId) throw new Error('cart not found')
			if (!cart.active) throw new Error('cart not active')

			return await this.resolve(
				{
					type: OrderType.cart,
					cartId: cart.id,
					vendorId: cart.vendorId,
					vendorType: cart.vendorType,
					packs: cart.packs,
				},
				session,
			)
		} else if ('cartLinkId' in data) {
			const cartLink = await CartLink.findById(data.cartLinkId, {}, { session })
			if (!cartLink) throw new Error('cart link not found')
			if (!cartLink.active) throw new Error('cart link not active')

			return await this.resolve(
				{
					type: OrderType.cartLink,
					cartLinkId: cartLink.id,
					vendorId: cartLink.vendorId,
					vendorType: cartLink.vendorType,
					packs: cartLink.packs,
				},
				session,
			)
		}

		throw new Error('invalid data')
	}

	async checkout(data: CheckoutInput) {
		let res = null as OrderFromModel | null
		await Order.collection.conn.transaction(async (session) => {
			const orderData = await this.getOrderData(data, session)
			const order = await new Order({
				...data,
				data: orderData,
				fee: await OrderEntity.calculateFees({ ...data, data: orderData }),
			}).save({ session })
			if ('cartId' in data) await Cart.findByIdAndUpdate(data.cartId, { $set: { active: false } }, { session })
			if ('cartLinkId' in data) await CartLink.findByIdAndUpdate(data.cartLinkId, { $set: { active: false } }, { session })
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
				[`status.${OrderStatus.accepted}`]: null,
				[`status.${OrderStatus.rejected}`]: null,
				$or: [{ 'data.vendorId': vendorId }, { 'data.type': OrderType.dispatch }],
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
				[`status.${OrderStatus.driverAssigned}`]: null,
			},
			{ $set: { driverId, [`status.${OrderStatus.driverAssigned}`]: { at: Date.now() } } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async generateToken(id: string, userId: string) {
		const order = this.mapper.mapFrom(await Order.findById(id))
		if (!order || order.userId !== userId) throw new NotAuthorizedError()
		if (order.getCurrentStatus() !== OrderStatus.driverAssigned) throw new NotAuthorizedError('Order delivery is not in progress')
		const token = Random.number(1e3, 1e4).toString()
		await appInstance.cache.set(`order-delivery-token-${token}`, id, 60 * 3)
		return token
	}

	async complete(id: string, userId: string, token: string) {
		const order = this.mapper.mapFrom(await Order.findById(id))
		if (!order || order.driverId !== userId) throw new NotAuthorizedError()
		if (order.getCurrentStatus() !== OrderStatus.driverAssigned) throw new NotAuthorizedError('Order delivery is not in progress')
		if (!order.getPaid()) throw new NotAuthorizedError('Order is not paid yet')
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

	async markRefunded(id: string) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				[`status.${OrderStatus.paid}`]: { $ne: null },
				[`status.${OrderStatus.refunded}`]: null,
			},
			{ $set: { [`status.${OrderStatus.refunded}`]: { at: Date.now() } } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async markShipped(id: string, userId: string) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				[`status.${OrderStatus.driverAssigned}`]: { $ne: null },
				[`status.${OrderStatus.shipped}`]: null,
				$or: [{ 'data.vendorId': userId }, { 'data.type': OrderType.dispatch, userId }],
			},
			{ $set: { [`status.${OrderStatus.shipped}`]: { at: Date.now() } } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}

	async cancel(id: string, userId: string) {
		const order = await Order.findOneAndUpdate(
			{
				_id: id,
				userId,
				[`status.${OrderStatus.cancelled}`]: { $ne: null },
				[`status.${OrderStatus.accepted}`]: null,
				[`status.${OrderStatus.rejected}`]: null,
			},
			{ $set: { [`status.${OrderStatus.cancelled}`]: { at: Date.now() }, done: true } },
			{ new: true },
		)
		return this.mapper.mapFrom(order)
	}
}
