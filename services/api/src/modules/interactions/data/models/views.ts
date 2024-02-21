import { EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface ViewFromModel extends ViewToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ViewToModel {
	entity: InteractionEntity
	user: EmbeddedUser
}
