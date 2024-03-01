import { Currencies } from '@modules/payment'

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

export type AcceptOrderInput = {
	id: string
	userId: string
	message: string
	accepted: boolean
}

export enum DeliveryStatus {
	created = 'created',
	inProgress = 'inProgress',
	failed = 'failed',
	completed = 'completed',
}
