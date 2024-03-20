import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { CartFromModel } from '../../data/models/carts'
import { CartEntity } from '../../domain/entities/carts'

export const CartDbChangeCallbacks: DbChangeCallbacks<CartFromModel, CartEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([`marketplace/carts/${after.userId}`, `marketplace/carts/${after.id}/${after.userId}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([`marketplace/carts/${after.userId}`, `marketplace/carts/${after.id}/${after.userId}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[`marketplace/carts/${before.userId}`, `marketplace/carts/${before.id}/${before.userId}`],
			before,
		)
	},
}
