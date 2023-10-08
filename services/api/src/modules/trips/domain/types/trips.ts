export enum TripStatus {
	created = 'created',
	driverAssigned = 'driverAssigned',
	driverArrived = 'driverArrived',
	started = 'started',
	ended = 'ended',
	detailed = 'detailed',
	cancelled = 'cancelled'
}

export type TripData = {
	timestamp: number
}