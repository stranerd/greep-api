import { BaseEntity } from '@stranerd/api-commons'

export class CustomerEntity extends BaseEntity {
	public readonly id: string
	public readonly name: string
	public readonly driverId: string
	public readonly trips: number
	public readonly debt: number
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, name, driverId, trips, debt, createdAt, updatedAt }: CustomerConstructorArgs) {
		super()
		this.id = id
		this.name = name
		this.driverId = driverId
		this.trips = trips
		this.debt = debt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type CustomerConstructorArgs = {
	id: string
	name: string
	driverId: string
	trips: number
	debt: number
	createdAt: number, updatedAt: number
}