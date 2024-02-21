import { EmbeddedUser, InteractionEntity } from '../../domain/types'

export interface ReportFromModel extends ReportToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ReportToModel {
	entity: InteractionEntity
	user: EmbeddedUser
	message: string
}
