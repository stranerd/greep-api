import { TransactionStatus, TransactionType, TransactionsUseCases } from '@modules/payment'
import { ActivitiesUseCases, ActivityType, mergeWithUsers } from '@modules/users'
import { appInstance } from '@utils/environment'
import { Conditions, DbChangeCallbacks } from 'equipped'
import { OrdersUseCases, ProductsUseCases } from '../..'
import { OrderFromModel } from '../../data/models/orders'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderStatus, OrderType, ProductMeta } from '../../domain/types'
import { TagMeta, TagsUseCases } from '@modules/interactions'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after
				.getMembers()
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${after.id}/${d}`])
				.flat(),
			(await mergeWithUsers([after], (e) => e.getMembers()))[0],
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
			after
				.getMembers()
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${after.id}/${d}`])
				.flat(),
			(await mergeWithUsers([after], (e) => e.getMembers()))[0],
		)

		const closed = !before.done && after.done
		const failed = closed && !after.status[OrderStatus.completed]
		const successful = closed && !!after.status[OrderStatus.completed]
		if (failed) {
			if (after.paid)
				await TransactionsUseCases.create({
					title: `Payment refund for order #${after.id}`,
					status: TransactionStatus.fulfilled,
					userId: after.userId,
					email: after.email,
					amount: after.fee.payable,
					currency: after.fee.currency,
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
		if (successful && 'products' in after.data) {
			const productIds = after.data.products.map((p) => p.id)
			const { results: products } = await ProductsUseCases.get({
				where: [{ field: 'id', condition: Conditions.in, value: productIds }],
			})
			const allTags = [...new Set(products.map((p) => p.tagIds).flat())]
			await ProductsUseCases.updateMeta({ ids: productIds, property: ProductMeta.orders, value: 1 })
			await TagsUseCases.updateMeta({ ids: allTags, property: TagMeta.orders, value: 1 })
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before
				.getMembers()
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${before.id}/${d}`])
				.flat(),
			(await mergeWithUsers([before], (e) => e.getMembers()))[0],
		)
	},
}
