export enum UserMeta {
	referrals = 'referrals',
	trips = 'trips',
	total = 'total'
}

export enum ActivityType {
	referrals = 'referrals',
	tripDiscount = 'tripDiscount',
	refundTripDiscount = 'refundTripDiscount'
}

export type ActivityData = {
	type: ActivityType.referrals,
	referralId: string
} | {
	type: ActivityType.tripDiscount,
	discount: number
	tripId: string
} | {
	type: ActivityType.refundTripDiscount,
	discount: number
	tripId: string
}