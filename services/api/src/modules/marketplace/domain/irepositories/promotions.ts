import { QueryParams, QueryResults } from 'equipped'
import { PromotionToModel } from '../../data/models/promotions'
import { PromotionEntity } from '../entities/promotions'

export interface IPromotionRepository {
	update(id: string, data: Partial<PromotionToModel>, userId: string): Promise<PromotionEntity | null>
	delete(id: string, userId: string): Promise<boolean>
	create(data: PromotionToModel): Promise<PromotionEntity>
	get(query: QueryParams): Promise<QueryResults<PromotionEntity>>
	find(id: string): Promise<PromotionEntity | null>
}
