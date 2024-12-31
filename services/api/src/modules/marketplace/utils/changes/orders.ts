import { TagMeta, TagsUseCases } from '@modules/interactions'
import { TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { ActivitiesUseCases, ActivityType, UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { Conditions, DbChangeCallbacks } from 'equipped'
import { mergeOrdersData } from '..'
import { OrdersUseCases, ProductsUseCases } from '../..'
import { OrderFromModel } from '../../data/models/orders'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderStatus, OrderType, ProductMeta } from '../../domain/types'
import { NotificationType, sendNotification } from '@modules/notifications'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			after
				.getMembers()
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${after.id}/${d}`])
				.flat(),
			await mergeOrdersData([after]).then((res) => res[0]),
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

		if (after.data.type === OrderType.cartLink) {
			const drivers = await UsersUseCases.get({
				where: [{ field: 'roles.isDriver', condition: Conditions.eq, value: true }],
			})

			await Promise.all(
				drivers.results.map(async (driver) => {
					await sendNotification([driver.id], {
						title: `New Order Created`,
						body: `A new ${after.data.type} order #${after.id} has been created.`,
						sendEmail: true,
						data: {
							type: NotificationType.OrderCreated,
							orderId: after.id,
							orderType: after.data.type,
							message: 'A new order is available for delivery.',
						},
					})
				}),
			)
		}
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			after
				.getMembers()
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${after.id}/${d}`])
				.flat(),
			{
				after: await mergeOrdersData([after]).then((res) => res[0]),
				before: await mergeOrdersData([before]).then((res) => res[0]),
			},
		)

		const closed = !before.done && after.done
		const failed = closed && !after.status[OrderStatus.completed]
		const successful = closed && !!after.status[OrderStatus.completed]
		if (failed) {
			if (after.getPaid())
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
		if (successful) {
			const productIds = after.getProductIds()
			const { results: products } = await ProductsUseCases.get({
				where: [{ field: 'id', condition: Conditions.in, value: productIds }],
			})
			const allTags = [...new Set(products.map((p) => p.tagIds).flat())]
			await ProductsUseCases.updateMeta({ ids: productIds, property: ProductMeta.orders, value: 1 })
			await TagsUseCases.updateMeta({ ids: allTags, property: TagMeta.orders, value: 1 })
			await UsersUseCases.incrementMeta({
				id: after.userId,
				value: 1,
				property: UserMeta.customerOrders,
			})
			const vendorId = after.getVendor()
			if (vendorId)
				await UsersUseCases.incrementMeta({
					id: vendorId,
					value: 1,
					property: UserMeta.vendorOrders,
				})
			if (after.driverId)
				await UsersUseCases.incrementMeta({
					id: after.driverId,
					value: 1,
					property: UserMeta.driverOrders,
				})
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			before
				.getMembers()
				.map((d) => [`marketplace/orders/${d}`, `marketplace/orders/${before.id}/${d}`])
				.flat(),
			await mergeOrdersData([before]).then((res) => res[0]),
		)
		const closed = before.done
		const successful = !!before.status[OrderStatus.completed]
		if (closed && successful) {
			await UsersUseCases.incrementMeta({
				id: before.userId,
				value: -1,
				property: UserMeta.customerOrders,
			})
			const vendorId = before.getVendor()
			if (vendorId)
				await UsersUseCases.incrementMeta({
					id: vendorId,
					value: -1,
					property: UserMeta.vendorOrders,
				})
			if (before.driverId)
				await UsersUseCases.incrementMeta({
					id: before.driverId,
					value: -1,
					property: UserMeta.driverOrders,
				})
		}
	},
}
