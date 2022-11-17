export enum TripStatus {
	gottenTrip = 'gottenTrip',
	startedTrip = 'startedTrip',
	endedTrip = 'endedTrip'
}

export type TripData = {
	timestamp: number
	coords: [number, number]
	location: string
}