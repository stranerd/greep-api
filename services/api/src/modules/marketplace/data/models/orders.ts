import { Currencies } from '@modules/payment'
import { OrderData, OrderStatusType, OrderToModelBase } from '../../domain/types'

export interface OrderFromModel extends OrderToModel {
	_id: string
	driverId: string | null
	status: OrderStatusType
	done: boolean
	price: {
		amount: number
		currency: Currencies
	}
	createdAt: number
	updatedAt: number
}

export interface OrderToModel extends OrderToModelBase {
	data: OrderData
}
