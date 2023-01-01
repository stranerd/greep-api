import { TripData, TripStatus } from '../../domain/types'

export interface TripFromModel extends TripToModel {
	id: string
	createdAt: number
	updatedAt: number
}

export interface TripToModel {
	driverId: string
	managerId: string
	status: TripStatus
	data: Partial<Record<TripStatus, TripData>>
}
