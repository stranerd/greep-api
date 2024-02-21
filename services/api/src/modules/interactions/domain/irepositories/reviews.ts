import { QueryParams, QueryResults } from 'equipped'
import { ReviewToModel } from '../../data/models/reviews'
import { ReviewEntity } from '../entities/reviews'
import { EmbeddedUser, Interaction } from '../types'

export interface IReviewRepository {
	get: (condition: QueryParams) => Promise<QueryResults<ReviewEntity>>
	find: (id: string) => Promise<ReviewEntity | null>
	add: (data: ReviewToModel) => Promise<ReviewEntity>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	deleteEntityReviews: (entity: Interaction) => Promise<boolean>
}
