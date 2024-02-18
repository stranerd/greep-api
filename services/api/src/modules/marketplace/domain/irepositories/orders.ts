import { QueryParams, QueryResults } from 'equipped'
import { OrderEntity } from '../entities/orders'

export interface IOrderRepository {
	get(query: QueryParams): Promise<QueryResults<OrderEntity>>
	find(id: string): Promise<OrderEntity | null>
}
