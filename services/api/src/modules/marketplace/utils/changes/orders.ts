import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { OrderFromModel } from '../../data/models/orders'
import { OrderEntity } from '../../domain/entities/orders'

export const OrderDbChangeCallbacks: DbChangeCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/orders', `marketplace/orders/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['marketplace/orders', `marketplace/orders/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/orders', `marketplace/orders/${before.id}`], before)
	},
}
