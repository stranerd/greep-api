import { BaseEntity } from 'equipped'
import { TripData, TripStatus } from '../types'

export class TripEntity extends BaseEntity {
	public readonly id: string
	public readonly customerId: string
	public readonly driverId: string | null
	public readonly status: TripStatus
	public readonly from: {
		coords: [number, number] | null
		location: string
		description: string
	}
	public readonly to: {
		coords: [number, number] | null
		location: string
		description: string
	}
	public readonly discount: number
	public readonly data: Partial<Record<TripStatus, TripData>>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, customerId, driverId, status, from, to, discount, data, createdAt, updatedAt }: TripConstructorArgs) {
		super()
		this.id = id
		this.customerId = customerId
		this.driverId = driverId
		this.status = status
		this.from = from
		this.to = to
		this.discount = discount
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type TripConstructorArgs = {
	id: string
	customerId: string
	driverId: string | null
	status: TripStatus
	from: {
		coords: [number, number] | null
		location: string
		description: string
	}
	to: {
		coords: [number, number] | null
		location: string
		description: string
	}
	discount: number
	data: Partial<Record<TripStatus, TripData>>
	createdAt: number
	updatedAt: number
}