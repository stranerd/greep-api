import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { DeliveryStatus } from '../types'

export class DeliveryEntity extends BaseEntity<DeliveryConstructorArgs> {
	constructor(data: DeliveryConstructorArgs) {
		super(data)
	}
}

type DeliveryConstructorArgs = {
	id: string
	userId: string
	driverId: string | null
	status: DeliveryStatus
	from: Location
	to: Location
	createdAt: number
	updatedAt: number
}
