import { BaseEntity } from 'equipped'
import { ActivityData, ActivityType } from '../types'

export class ActivityEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly data: ActivityData
	public readonly score: number
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, data, score, createdAt, updatedAt }: ActivityConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.data = data
		this.score = score
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	static getScore(data: ActivityData) {
		if (data.type === ActivityType.referrals) return 100
		if (data.type === ActivityType.completedTrip) return 10
		if (data.type === ActivityType.tripDiscount) return -data.discount * 25
		if (data.type === ActivityType.refundTripDiscount) return data.discount * 25
		return 0
	}
}

type ActivityConstructorArgs = {
	id: string
	userId: string
	data: ActivityData
	score: number
	createdAt: number
	updatedAt: number
}
