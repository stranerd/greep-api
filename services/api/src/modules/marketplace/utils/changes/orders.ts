import { TransactionStatus, TransactionType, TransactionsUseCases } from '@modules/payment'
import { ActivitiesUseCases, ActivityType } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { OrdersUseCases } from '../..'
import { OrderFromModel } from '../../data/models/orders'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderPayment, OrderStatus, OrderType } from '../../domain/types'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.userId, after.getVendorId(), after.driverId]
				.filter(Boolean)
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${after.id}/${d}`])
				.flat(),
			after,
		)

		if (after.data.type === OrderType.dispatch)
			await OrdersUseCases.accept({
				id: after.id,
				userId: after.userId,
				message: 'Order accepted',
				accepted: true,
			})

		if (after.discount > 0)
			await ActivitiesUseCases.create({
				userId: after.userId,
				data: {
					type: ActivityType.orderDiscount,
					orderId: after.id,
					discount: after.discount,
				},
			})
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[after.userId, after.getVendorId(), after.driverId]
				.filter(Boolean)
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${after.id}/${d}`])
				.flat(),
			after,
		)

		const closed = !before.done && after.done
		const rejected = closed && !!after.status[OrderStatus.completed]
		if (rejected) {
			if (after.payment === OrderPayment.wallet)
				await TransactionsUseCases.create({
					title: `Payment refund for order #${after.id}`,
					status: TransactionStatus.fulfilled,
					userId: after.userId,
					email: after.email,
					amount: after.price.amount,
					currency: after.price.currency,
					data: {
						type: TransactionType.OrderPaymentRefund,
						orderId: after.id,
					},
				})
			if (after.discount > 0)
				await ActivitiesUseCases.create({
					userId: after.userId,
					data: {
						type: ActivityType.refundOrderDiscount,
						orderId: after.id,
						discount: after.discount,
					},
				})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.userId, before.getVendorId(), before.driverId]
				.filter(Boolean)
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${before.id}/${d}`])
				.flat(),
			before,
		)
	},
}
