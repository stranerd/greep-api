import { QueryParams, QueryResults } from 'equipped'
import { CommentToModel } from '../../data/models/comments'
import { CommentEntity } from '../entities/comments'
import { CommentMeta, Interaction } from '../types'

export interface ICommentRepository {
	add: (data: CommentToModel) => Promise<CommentEntity>
	get: (query: QueryParams) => Promise<QueryResults<CommentEntity>>
	find: (id: string) => Promise<CommentEntity | null>
	update: (id: string, userId: string, data: Partial<CommentToModel>) => Promise<CommentEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	deleteEntityComments: (entity: Interaction) => Promise<boolean>
	updateMeta: (commentId: string, property: CommentMeta, value: 1 | -1) => Promise<void>
	updateUserBio: (user: CommentToModel['user']) => Promise<boolean>
}
