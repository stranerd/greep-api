import { QueryParams, QueryResults } from 'equipped'
import { CartLinkToModel } from '../../data/models/cartLinks'
import { CartLinkEntity } from '../entities/cartLinks'

export interface ICartLinkRepository {
	create(data: CartLinkToModel): Promise<CartLinkEntity>
	update(id: string, userId: string, data: Partial<CartLinkToModel>): Promise<CartLinkEntity | null>
	get(query: QueryParams): Promise<QueryResults<CartLinkEntity>>
	find(id: string): Promise<CartLinkEntity | null>
}
