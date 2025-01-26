import { EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface LikeFromModel extends LikeToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface LikeToModel {
	value: boolean
	entity: InteractionEntity
	user: EmbeddedUser
}
