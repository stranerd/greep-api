import { MediaOutput } from 'equipped'
import { EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface MediaFromModel extends MediaToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface MediaToModel {
	file: MediaOutput
	entity: InteractionEntity
	user: EmbeddedUser
}
