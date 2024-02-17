import { BaseEntity } from 'equipped'
import { ActivityData, ActivityType } from '../types'

export class ActivityEntity extends BaseEntity<ActivityConstructorArgs> {
	constructor(data: ActivityConstructorArgs) {
		super(data)
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
