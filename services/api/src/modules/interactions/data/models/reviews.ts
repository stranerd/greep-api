import { EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface ReviewFromModel extends ReviewToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ReviewToModel {
	entity: InteractionEntity
	user: EmbeddedUser
	rating: number
	message: string
}
