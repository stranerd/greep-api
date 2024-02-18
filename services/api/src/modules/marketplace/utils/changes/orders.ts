import { OrderPayment } from '@modules/marketplace/domain/types'
import { TransactionStatus, TransactionType, TransactionsUseCases } from '@modules/payment'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { OrderFromModel } from '../../data/models/orders'
import { OrderEntity } from '../../domain/entities/orders'
import { ActivitiesUseCases, ActivityType } from '@modules/users'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/orders', `marketplace/orders/${after.id}`], after)

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
		await appInstance.listener.updated(['marketplace/orders', `marketplace/orders/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/orders', `marketplace/orders/${before.id}`], before)
	},
}
