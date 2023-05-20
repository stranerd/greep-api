import { BaseEntity } from 'equipped'
import { TripData, TripStatus } from '../types'

export class TripEntity extends BaseEntity {
	public readonly id: string
	public readonly managerId: string
	public readonly driverId: string
	public readonly status: TripStatus
	public readonly data: Partial<Record<TripStatus, TripData>>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, managerId, driverId, status, data, createdAt, updatedAt }: TripConstructorArgs) {
		super()
		this.id = id
		this.managerId = managerId
		this.driverId = driverId
		this.status = status
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type TripConstructorArgs = {
	id: string
	managerId: string
	driverId: string
	status: TripStatus
	data: Partial<Record<TripStatus, TripData>>
	createdAt: number
	updatedAt: number
}