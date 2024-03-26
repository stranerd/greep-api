import { Currencies } from '@modules/payment'
import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { DeliveryTime, OrderData, OrderPayment, OrderType, OrderStatus } from '../types'

type OrderEntityProps = {
	id: string
	userId: string
	email: string
	driverId: string | null
	status: OrderStatus
	pickupLocation: Location
	location: Location
	dropoffNote: string
	data: OrderData
	time: DeliveryTime
	discount: number
	payment: OrderPayment
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

export class OrderEntity extends BaseEntity<OrderEntityProps> {
	ignoreInJSON = ['email']

	constructor(data: OrderEntityProps) {
		super(data)
	}

	getVendorId() {
		if (this.data.type === OrderType.cart) return this.data.vendorId
		return null
	}

	get deliveryFee() {
		// TODO: calculate based on distance between pickup and dropoff location
		return 10
	}

	get totalFee() {
		return this.deliveryFee + this.price.amount
	}
}
