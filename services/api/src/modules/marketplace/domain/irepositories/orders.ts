import { QueryParams, QueryResults } from 'equipped'
import { OrderToModel } from '../../data/models/orders'
import { OrderEntity } from '../entities/orders'
import { AcceptOrderInput, CheckoutInput } from '../types'

export interface IOrderRepository {
	create(data: OrderToModel): Promise<OrderEntity>
	checkout(data: CheckoutInput): Promise<OrderEntity>
	get(query: QueryParams): Promise<QueryResults<OrderEntity>>
	find(id: string): Promise<OrderEntity | null>
	accept(input: AcceptOrderInput): Promise<OrderEntity | null>
	assignDriver: (id: string, driverId: string) => Promise<OrderEntity | null>
	generateToken: (id: string, userId: string) => Promise<string>
	cancel: (id: string, userId: string) => Promise<OrderEntity | null>
	complete: (id: string, userId: string, token: string) => Promise<OrderEntity | null>
	markPaid: (id: string, driverId: string | null) => Promise<OrderEntity | null>
	markRefunded: (id: string) => Promise<OrderEntity | null>
}
