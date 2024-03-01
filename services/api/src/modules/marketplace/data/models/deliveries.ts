import { Location } from '@utils/types'
import { DeliveryStatus } from '../../domain/types'

export interface DeliveryFromModel extends DeliveryToModel {
	_id: string
	driverId: string | null
	status: DeliveryStatus
	createdAt: number
	updatedAt: number
}

export interface DeliveryToModel {
	userId: string
	from: Location
	to: Location
}
