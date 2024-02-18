import { Currencies } from '@modules/payment'
import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { CartProductItem, DeliveryTime, OrderPayment } from '../types'

type OrderEntityProps = {
	id: string
	products: CartProductItem[]
	userId: string
	email: string
	vendorId: string
	cartId: string
	location: Location
	dropoffNote: string
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
	constructor(data: OrderEntityProps) {
		super(data)
	}
}