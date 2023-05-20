export enum UserMeta {
	referrals = 'referrals',
	trips = 'trips',
	total = 'total'
}

export type ActivityData = {
	type: UserMeta.referrals,
	referralId: string
} | {
	type: UserMeta.trips,
	tripId: string
}

export enum ActivityScores {
	newReferral = 100
}