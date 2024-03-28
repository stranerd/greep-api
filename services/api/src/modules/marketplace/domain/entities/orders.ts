import { Currencies, FlutterwavePayment } from '@modules/payment'
import { calculateDistanceBetween } from '@utils/geo'
import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { DeliveryTime, OrderData, OrderFee, OrderPayment, OrderStatus, OrderStatusType, OrderType } from '../types'

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
	fee: OrderFee
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

	static async calculateFees(data: {
		userId: string
		data: OrderData
		from: Location
		to: Location
		discount: number
		time: DeliveryTime
		payment: OrderPayment
	}): Promise<OrderFee> {
		const items = data.data.type === OrderType.cart ? data.data.products : []
		const currency = Currencies.TRY
		const convertedItems = await Promise.all(
			items.map((item) => FlutterwavePayment.convertAmount(item.amount * item.quantity, item.currency, currency)),
		)
		const subTotal = convertedItems.reduce((acc, item) => acc + item, 0)
		const vatPercentage = 0.05
		const vat = subTotal * vatPercentage
		const distance = calculateDistanceBetween(data.from.coords, data.to.coords)
		const feePerMeters = 15 / 1000
		const fee = distance * feePerMeters
		const total = subTotal + vat + fee
		const payable = total * (1 - data.discount * 0.01)
		return {
			vatPercentage,
			vat,
			fee,
			subTotal,
			total,
			payable,
			currency,
		}
	}
}
