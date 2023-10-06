import { TripData, TripStatus } from '../../domain/types'

export interface TripFromModel extends TripToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface TripToModel {
	driverId: string
	status: TripStatus
	data: Partial<Record<TripStatus, TripData>>
}
