import { Currencies } from '@modules/payment'
import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { DeliveryTime, OrderData, OrderPayment, OrderStatus, OrderStatusType, OrderType } from '../types'

type OrderEntityProps = {
	id: string
	userId: string
	email: string
	driverId: string | null
	status: OrderStatusType
	done: boolean
	from: Location
	to: Location
	dropoffNote: string
	data: OrderData
	time: DeliveryTime
	discount: number
	payment: OrderPayment
	price: {
		amount: number
		currency: Currencies
	}
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
		return (this.deliveryFee + this.price.amount) * (1 - this.discount * 0.01)
	}

	get currentStatus() {
		if (this.status[OrderStatus.completed]) return OrderStatus.completed
		if (this.status[OrderStatus.cancelled]) return OrderStatus.cancelled
		if (this.status[OrderStatus.rejected]) return OrderStatus.rejected
		if (this.status[OrderStatus.deliveryDriverAssigned]) return OrderStatus.deliveryDriverAssigned
		return null
	}

	get paid() {
		return !!this.status[OrderStatus.paid]
	}
}
