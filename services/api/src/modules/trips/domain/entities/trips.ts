import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { TripData, TripStatus } from '../types'

export class TripEntity extends BaseEntity<TripConstructorArgs> {
	constructor(data: TripConstructorArgs) {
		super(data)
	}
}

type TripConstructorArgs = {
	id: string
	customerId: string
	driverId: string | null
	requestedDriverId: string | null
	status: TripStatus
	from: Location
	to: Location
	discount: number
	data: Partial<Record<TripStatus, TripData>>
	createdAt: number
	updatedAt: number
}
