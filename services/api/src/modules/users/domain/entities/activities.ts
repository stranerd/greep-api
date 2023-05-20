import { BaseEntity } from 'equipped'
import { ActivityData } from '../types'

export class ActivityEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly data: ActivityData
	public readonly score: number
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, userId, data, score, createdAt, updatedAt }: ActivityConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.data = data
		this.score = score
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type ActivityConstructorArgs = {
	id: string, userId: string, data: ActivityData, score: number,
	createdAt: number, updatedAt: number
}
