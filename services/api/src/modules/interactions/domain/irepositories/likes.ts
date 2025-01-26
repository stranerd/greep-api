import { QueryParams, QueryResults } from 'equipped'
import { LikeToModel } from '../../data/models/likes'
import { LikeEntity } from '../entities/likes'
import { Interaction } from '../types'

export interface ILikeRepository {
	like: (data: LikeToModel) => Promise<LikeEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<LikeEntity>>
	find: (id: string) => Promise<LikeEntity | null>
	deleteEntityLikes: (entity: Interaction) => Promise<boolean>
	updateUserBio: (user: LikeToModel['user']) => Promise<boolean>
}
