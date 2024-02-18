import { Currencies } from '@modules/payment'
import { Location } from '@utils/types'

export type AddToCartInput = {
	productId: string
	quantity: number
	userId: string
	add: boolean
}

export type CartProductItem = {
	id: string
	quantity: number
	amount: number
	currency: Currencies
}

export type DeliveryTime = {
	date: number
	time: string
}

export enum OrderPayment {
	wallet = 'wallet',
	cash = 'cash',
}

export type CheckoutCart = {
	userId: string
	cartId: string
	location: Location
	dropoffNote: string
	time: DeliveryTime
	discount: number
	payment: OrderPayment
}
