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

export class OrderEntity extends BaseEntity<OrderEntityProps, 'email'> {
	__ignoreInJSON = ['email' as const]

	constructor(data: OrderEntityProps) {
		super(data)
	}

	getMembers() {
		const members = [this.userId]
		if (this.driverId) members.push(this.driverId)
		if (this.data.type === OrderType.cart) members.push(this.data.vendorId)
		return members
	}

	get currentStatus() {
		if (this.status[OrderStatus.completed]) return OrderStatus.completed
		if (this.status[OrderStatus.cancelled]) return OrderStatus.cancelled
		if (this.status[OrderStatus.rejected]) return OrderStatus.rejected
		if (this.status[OrderStatus.driverAssigned]) return OrderStatus.driverAssigned
		return null
	}

	get paid() {
		return !!this.status[OrderStatus.paid]
	}

	get timeline() {
		const statuses = [OrderStatus.created]
		if (this.status[OrderStatus.rejected]) {
			statuses.push(OrderStatus.rejected)
			if (this.paid) statuses.push(OrderStatus.refunded)
		} else if (this.status[OrderStatus.cancelled]) {
			statuses.push(OrderStatus.cancelled)
			if (this.paid) statuses.push(OrderStatus.refunded)
		} else statuses.push(OrderStatus.accepted, OrderStatus.shipped, OrderStatus.completed)
		return statuses
			.map((status) => ({
				status,
				title: statusTitles[status],
				at: this.status[status]?.at ?? null,
				done: !!this.status[status],
			}))
			.sort((a, b) => (a.at ?? Number.MAX_SAFE_INTEGER) - (b.at ?? Number.MAX_SAFE_INTEGER))
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
		const discountedOff = data.discount * 10
		const payable = Math.max(total - discountedOff, 0)
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

const statusTitles: Record<OrderStatus, string> = {
	[OrderStatus.created]: 'Order Placed',
	[OrderStatus.accepted]: 'Order Accepted',
	[OrderStatus.rejected]: 'Order Rejected',
	[OrderStatus.driverAssigned]: 'Driver Assigned',
	[OrderStatus.shipped]: 'Order Shipped',
	[OrderStatus.cancelled]: 'Order Cancelled',
	[OrderStatus.completed]: 'Order Completed',
	[OrderStatus.paid]: 'Order Paid',
	[OrderStatus.refunded]: 'Order Refunded',
}
