import { QueryParams, QueryResults } from 'equipped'
import { CartLinkToModel } from '../../data/models/cartLinks'
import { CartEntity } from '../entities/carts'

export interface ICartLinkRepository {
	create(data: CartLinkToModel): Promise<CartEntity>
	update(id: string, userId: string, data: Partial<CartLinkToModel>): Promise<CartEntity | null>
	get(query: QueryParams): Promise<QueryResults<CartEntity>>
	find(id: string): Promise<CartEntity | null>
}
