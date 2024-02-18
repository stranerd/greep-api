import { OrderPayment } from '@modules/marketplace/domain/types'
import { TransactionStatus, TransactionType, TransactionsUseCases } from '@modules/payment'
import { ActivitiesUseCases, ActivityType } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { OrderFromModel } from '../../data/models/orders'
import { OrderEntity } from '../../domain/entities/orders'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.userId, after.vendorId, `${after.userId}/${after.id}`, `${after.vendorId}/${after.id}`].map(
				(d) => `marketplace/orders/${d}`,
			),
			after,
		)

		if (after.payment === OrderPayment.wallet)
			await TransactionsUseCases.create({
				title: `Order payment for order #${after.id}`,
				status: TransactionStatus.initialized,
				userId: after.userId,
				email: after.email,
				amount: after.price.amount,
				currency: after.price.currency,
				data: {
					type: TransactionType.OrderPayment,
					orderId: after.id,
				},
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
	updated: async ({ after }) => {
		await appInstance.listener.updated(
			[after.userId, after.vendorId, `${after.userId}/${after.id}`, `${after.vendorId}/${after.id}`].map(
				(d) => `marketplace/orders/${d}`,
			),
			after,
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.userId, before.vendorId, `${before.userId}/${before.id}`, `${before.vendorId}/${before.id}`].map(
				(d) => `marketplace/orders/${d}`,
			),
			before,
		)
	},
}
