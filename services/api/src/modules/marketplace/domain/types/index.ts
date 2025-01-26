import { Phone } from '@modules/auth'
import { Currencies } from '@modules/payment'
import { UserVendorType } from '@modules/users'
import { Location } from '@utils/types'
export type { EmbeddedUser } from '@modules/users'

export type AddToCartInput = {
	productId: string
	quantity: number
	userId: string
	pack: number
	addOn: {
		groupName: string
		itemName: string
	} | null
	add: boolean
}

export type CartProductItem = {
	id: string
	quantity: number
	price: {
		amount: number
		currency: Currencies
	}
	addOns: {
		groupName: string
		itemName: string
		quantity: number
		price: {
			amount: number
			currency: Currencies
		}
	}[]
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
			vendorType: UserVendorType
			packs: CartProductItem[][]
	  }
	| {
			type: OrderType.cartLink
			cartLinkId: string
			vendorId: string
			vendorType: UserVendorType
			packs: CartProductItem[][]
	  }
	| {
			type: OrderType.dispatch
			deliveryType: OrderDispatchDeliveryType
			description: string
			size: number
			recipientName: string
			recipientPhone: Phone
			deliveryFee: number
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
	promotionIds: string[]
}

export type CheckoutInput = OrderToModelBase & ({ cartId: string } | { cartLinkId: string })

export type OrderFee = {
	vatPercentage: number
	vat: number
	preFee: number
	fee: number
	preSubTotal: number
	subTotal: number
	total: number
	currency: Currencies
	payable: number
	promotions: { id: string; data: PromotionData }[]
}

export enum ProductMeta {
	orders = 'orders',

	total = 'total',
}

export type ProductMetaType = Record<ProductMeta, number>

export type ProductData =
	| {
			type: UserVendorType.items
	  }
	| {
			type: UserVendorType.foods
			prepTimeInMins: { from: number; to: number }
	  }

export type ProductAddOns = Record<
	string,
	{
		minSelection: number | null
		maxSelection: number | null
		items: Record<string, { price: { amount: number; currency: Currencies }; inStock: boolean }>
	}
>

export enum PromotionType {
	freeDelivery = 'freeDelivery',
	fixedAmountDiscount = 'fixedAmountDiscount',
	percentageAmountDiscount = 'percentageAmountDiscount',
}

export type PromotionData =
	| {
			type: PromotionType.freeDelivery
	  }
	| {
			type: PromotionType.fixedAmountDiscount
			amount: number
			currency: Currencies
			lowerLimit: number | null
	  }
	| {
			type: PromotionType.percentageAmountDiscount
			percentage: number
			currency: Currencies
			lowerLimit: number | null
	  }

export type PromotionValidity = {
	from: number
	to: number
}
