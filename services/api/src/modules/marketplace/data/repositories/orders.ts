import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IOrderRepository } from '../../domain/irepositories/orders'
import { OrderMapper } from '../mappers/orders'
import { Order } from '../mongooseModels/orders'

export class OrderRepository implements IOrderRepository {
	private static instance: OrderRepository
	private mapper = new OrderMapper()

	static getInstance(): OrderRepository {
		if (!OrderRepository.instance) OrderRepository.instance = new OrderRepository()
		return OrderRepository.instance
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
