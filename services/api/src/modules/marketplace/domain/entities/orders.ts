import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { CartProductItem, DeliveryTime, OrderPayment } from '../types'

type OrderEntityProps = {
	id: string
	products: CartProductItem[]
	userId: string
	cartId: string
	location: Location
	dropoffNote: string
	time: DeliveryTime
	discount: number
	payment: OrderPayment
	createdAt: number
	updatedAt: number
}

export class OrderEntity extends BaseEntity<OrderEntityProps> {
	constructor(data: OrderEntityProps) {
		super(data)
	}
}
