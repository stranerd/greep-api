export enum TripStatus {
	gotten = 'gotten',
	started = 'started',
	ended = 'ended',
	detailed = 'detailed'
}

export type TripData = {
	timestamp: number
	coords: [number, number]
	location: string
}
