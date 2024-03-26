import { Currencies } from '@modules/payment'
import { OrderData, OrderStatus, OrderToModelBase } from '../../domain/types'

export interface OrderFromModel extends OrderToModel {
	_id: string
	driverId: string | null
	status: OrderStatus
	price: {
		amount: number
		currency: Currencies
	}
	accepted: {
		at: number
		message: number
		is: boolean
	} | null
	createdAt: number
	updatedAt: number
}

export interface OrderToModel extends OrderToModelBase {
	data: OrderData
}
