export enum UserMeta {
	referrals = 'referrals',
	trips = 'trips',
	total = 'total',
}

export enum ActivityType {
	referrals = 'referrals',
	completedTrip = 'completedTrip',
	tripDiscount = 'tripDiscount',
	refundTripDiscount = 'refundTripDiscount',
	orderDiscount = 'orderDiscount',
	refundOrderDiscount = 'refundOrderDiscount',
}

export type ActivityData =
	| {
			type: ActivityType.referrals
			referralId: string
	  }
	| {
			type: ActivityType.tripDiscount
			discount: number
			tripId: string
	  }
	| {
			type: ActivityType.refundTripDiscount
			discount: number
			tripId: string
	  }
	| {
			type: ActivityType.completedTrip
			tripId: string
	  }
	| {
			type: ActivityType.orderDiscount
			orderId: string
			discount: number
	  }
	| {
			type: ActivityType.refundOrderDiscount
			orderId: string
			discount: number
	  }
