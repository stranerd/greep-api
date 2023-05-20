import { ActivityData } from '../../domain/types'

export interface ActivityFromModel extends ActivityToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ActivityToModel {
	userId: string
	data: ActivityData
	score: number
}