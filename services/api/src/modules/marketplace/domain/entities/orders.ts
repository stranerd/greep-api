import { Currencies, FlutterwavePayment } from '@modules/payment'
import { calculateDistanceBetween } from '@utils/geo'
import { Location } from '@utils/types'
import { BaseEntity } from 'equipped'
import { resolvePacks } from '../../utils/carts'
import { EmbeddedUser, OrderData, OrderFee, OrderPayment, OrderStatus, OrderStatusType, OrderToModelBase, PromotionType } from '../types'
import { EmbeddedProduct } from './products'
import { PromotionEntity } from './promotions'

type OrderEntityProps = OrderToModelBase & {
	id: string
	driverId: string | null
	status: OrderStatusType
	done: boolean
	data: OrderData
	fee: OrderFee
	createdAt: number
	updatedAt: number
}

export class OrderEntity extends BaseEntity<OrderEntityProps, 'email'> {
	__ignoreInJSON = ['email' as const]
	public users: Record<string, EmbeddedUser | null> = {}
	public products: Record<string, EmbeddedProduct | null> = {}

	constructor(data: OrderEntityProps) {
		super(data)
	}

	getMembers() {
		const members = [this.userId]
		if (this.driverId) members.push(this.driverId)
		if ('vendorId' in this.data) members.push(this.data.vendorId)
		return members
	}

	getCurrentStatus() {
		if (this.status[OrderStatus.completed]) return OrderStatus.completed
		if (this.status[OrderStatus.cancelled]) return OrderStatus.cancelled
		if (this.status[OrderStatus.rejected]) return OrderStatus.rejected
		if (this.status[OrderStatus.driverAssigned]) return OrderStatus.driverAssigned
		return null
	}

	getPaid() {
		return !!this.status[OrderStatus.paid]
	}

	getProductIds() {
		return resolvePacks('packs' in this.data ? this.data.packs : []).map((p) => p.id)
	}

	getVendor() {
		if ('vendorId' in this.data) return this.data.vendorId
		return null
	}

	get timeline() {
		const statuses = [OrderStatus.created]
		if (this.status[OrderStatus.rejected]) {
			statuses.push(OrderStatus.rejected)
			if (this.getPaid()) statuses.push(OrderStatus.refunded)
		} else if (this.status[OrderStatus.cancelled]) {
			statuses.push(OrderStatus.cancelled)
			if (this.getPaid()) statuses.push(OrderStatus.refunded)
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

	get activeStatus() {
		if (this.done) return null
		if (this.status[OrderStatus.shipped]) return OrderStatus.shipped
		if (this.status[OrderStatus.accepted]) return OrderStatus.accepted
		if (this.status[OrderStatus.created]) return OrderStatus.created
		return null
	}

	static async calculateFees(
		data: {
			userId: string
			data: OrderData
			from: Location
			to: Location
			discount: number
			time: number
			payment: OrderPayment
			promotionIds: string[]
		},
		promotions: PromotionEntity[],
	): Promise<OrderFee> {
		const vendorId = 'vendorId' in data.data ? data.data.vendorId : null
		const vendorType = 'vendorType' in data.data ? data.data.vendorType : null
		const activePromotions = promotions.filter((promo) =>
			[
				promo.active,
				data.promotionIds.includes(promo.id),
				promo.vendorIds?.includes(vendorId!) ?? true,
				promo.vendorType?.includes(vendorType!) ?? true,
			].every(Boolean),
		)
		const hasFreeDelivery = activePromotions.some((promo) => promo.data.type === PromotionType.freeDelivery)

		const percentageDiscount = Math.min(
			activePromotions
				.map((promo) => (promo.data.type === PromotionType.percentageAmountDiscount ? promo.data.percentage : 0))
				.reduce((acc, price) => acc + price, 0) / 100,
			1,
		)
		const fixedAmountDiscount = (
			await Promise.all(
				activePromotions.map((promo) =>
					promo.data.type === PromotionType.fixedAmountDiscount
						? FlutterwavePayment.convertAmount(promo.data.amount, promo.data.currency, Currencies.TRY)
						: 0,
				),
			)
		).reduce((acc, price) => acc + price, 0)

		const items = resolvePacks('packs' in data.data ? data.data.packs : [])
		const currency = Currencies.TRY
		const convertedItems = await Promise.all(
			items
				.flatMap((item) => [...Object.values(item.addOns), item])
				.map((item) => FlutterwavePayment.convertAmount(item.price.amount * item.quantity, item.price.currency, currency)),
		)
		const preSubTotal = convertedItems.reduce((acc, item) => acc + item, 0)
		const subTotal = Math.max(preSubTotal - fixedAmountDiscount, 0) * (1 - percentageDiscount)

		const vatPercentage = 0.05
		const vatCap = 25
		const vat = Math.min(subTotal * vatPercentage, vatCap)

		const distance = calculateDistanceBetween(data.from.coords, data.to.coords)
		const feePerMeters = 15 / 1000
		const preFee = distance * feePerMeters
		const fee = hasFreeDelivery ? 0 : preFee

		const total = subTotal + vat + fee
		const discountedOff = data.discount * 10
		const payable = Math.max(total - discountedOff, 0)

		return {
			vatPercentage,
			vat,
			preFee,
			fee,
			preSubTotal,
			subTotal,
			total,
			payable,
			currency,
			promotions: activePromotions.map((promo) => ({ id: promo.id, data: promo.data })),
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
