import { TripData, TripStatus } from '../../domain/types'

export interface TripFromModel extends TripToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface TripToModel {
	customerId: string
	status: TripStatus
	driverId: string | null
	data: Partial<Record<TripStatus, TripData>>
	from: {
		coords: [number, number]
		location: string
	}
	to: {
		coords: [number, number]
		location: string
	}
}
