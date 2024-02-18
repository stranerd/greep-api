import { QueryParams, QueryResults } from 'equipped'
import { OrderToModel } from '../../data/models/orders'
import { OrderEntity } from '../entities/orders'

export interface IOrderRepository {
	checkout(data: OrderToModel): Promise<OrderEntity>
	get(query: QueryParams): Promise<QueryResults<OrderEntity>>
	find(id: string): Promise<OrderEntity | null>
}
