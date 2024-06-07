import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { CartProductItem, DeliveryTime, OrderPayment } from '../types'

type CartLinkEntityProps = {
	id: string
	active: boolean
	products: CartProductItem[]
	userId: string
	vendorId: string
	to: Location
	time: DeliveryTime
	payment: OrderPayment
	createdAt: number
	updatedAt: number
}

export class CartLinkEntity extends BaseEntity<CartLinkEntityProps> {
	constructor(data: CartLinkEntityProps) {
		super(data)
	}
}
