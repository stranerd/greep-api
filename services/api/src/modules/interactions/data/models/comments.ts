import { CommentMetaType, EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface CommentFromModel extends CommentToModel {
	_id: string
	meta: CommentMetaType
	createdAt: number
	updatedAt: number
}

export interface CommentToModel {
	body: string
	entity: InteractionEntity
	user: EmbeddedUser
}
