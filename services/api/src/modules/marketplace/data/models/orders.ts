import { OrderData, OrderFee, OrderStatusType, OrderToModelBase } from '../../domain/types'

export interface OrderFromModel extends OrderToModel {
	_id: string
	driverId: string | null
	status: OrderStatusType
	done: boolean
	fee: OrderFee
	createdAt: number
	updatedAt: number
}

export interface OrderToModel extends OrderToModelBase {
	data: OrderData
}
