export enum TripStatus {
	gottenTrip = 'gottenTrip',
	startedTrip = 'startedTrip',
	endedTrip = 'endedTrip',
	detailed = 'detailed'
}

export type TripData = {
	timestamp: number
	coords: [number, number]
	location: string
}