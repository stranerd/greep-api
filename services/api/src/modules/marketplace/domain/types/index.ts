import { Phone } from '@modules/auth'
import { Currencies } from '@modules/payment'
import { Location } from '@utils/types'
export type { EmbeddedUser } from '@modules/users'

export type AddToCartInput = {
	productId: string
	quantity: number
	userId: string
	pack: number
	add: boolean
}

export type CartProductItem = {
	id: string
	quantity: number
	amount: number
	currency: Currencies
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
	created = 'created',
	paid = 'paid',
	accepted = 'accepted',
	rejected = 'rejected',
	driverAssigned = 'driverAssigned',
	shipped = 'shipped',
	cancelled = 'cancelled',
	completed = 'completed',
	refunded = 'refunded',
}

export type OrderStatusType = Record<OrderStatus, { at: number; message?: string } | null>

export enum OrderType {
	cart = 'cart',
	cartLink = 'cartLink',
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
			packs: CartProductItem[][]
	  }
	| {
			type: OrderType.cartLink
			cartLinkId: string
			vendorId: string
			packs: CartProductItem[][]
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
	time: number
	discount: number
	payment: OrderPayment
}

export type CheckoutInput = OrderToModelBase & ({ cartId: string } | { cartLinkId: string })

export type OrderFee = {
	vatPercentage: number
	vat: number
	fee: number
	subTotal: number
	total: number
	currency: Currencies
	payable: number
}

export enum ProductMeta {
	orders = 'orders',

	total = 'total',
}

export type ProductMetaType = Record<ProductMeta, number>
