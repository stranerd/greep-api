import { Phone } from '@modules/auth'
import { Currencies } from '@modules/payment'
import { Location } from '@utils/types'
export type { EmbeddedUser } from '@modules/users'

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

export enum OrderStatus {
	pendingPayment = 'pendingPayment',
	paid = 'paid',
	accepted = 'accepted',
	rejected = 'rejected',
	deliveryDriverAssigned = 'deliveryDriverAssigned',
	cancelled = 'cancelled',
	completed = 'completed',
}

export type OrderStatusType = Record<OrderStatus, { at: number; message?: string } | null>

export enum OrderType {
	cart = 'cart',
	dispatch = 'dispatch',
}

export enum OrderDispatchDeliveryType {
	standard = 'standard',
	perishable = 'perishable',
	fragile = 'fragile',
	others = 'others',
}

export type OrderData =
	| {
			type: OrderType.cart
			cartId: string
			vendorId: string
			products: CartProductItem[]
	  }
	| {
			type: OrderType.dispatch
			deliveryType: OrderDispatchDeliveryType
			description: string
			size: number
			recipientName: string
			recipientPhone: Phone
	  }

export type OrderToModelBase = {
	userId: string
	email: string
	from: Location
	to: Location
	dropoffNote: string
	time: DeliveryTime
	discount: number
	payment: OrderPayment
}

export type CheckoutInput = OrderToModelBase & {
	cartId: string
}

export type OrderFee = {
	vatPercentage: number
	vat: number
	fee: number
	subTotal: number
	total: number
	currency: Currencies
	payable: number
}
