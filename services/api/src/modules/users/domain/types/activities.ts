export enum UserMeta {
	referrals = 'referrals',
	trips = 'trips',
	total = 'total'
}

export type ActivityData = {
	type: UserMeta.referrals,
	referralId: string
}

export enum ActivityScores {
	newReferral = 100
}