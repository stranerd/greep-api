import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { mergeCartsData } from '..'
import { CartFromModel } from '../../data/models/carts'
import { CartEntity } from '../../domain/entities/carts'

export const CartDbChangeCallbacks: DbChangeCallbacks<CartFromModel, CartEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[`marketplace/carts/${after.userId}`, `marketplace/carts/${after.id}/${after.userId}`],
			await mergeCartsData([after]).then((res) => res[0]),
		)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated([`marketplace/carts/${after.userId}`, `marketplace/carts/${after.id}/${after.userId}`], {
			after: await mergeCartsData([after]).then((res) => res[0]),
			before: await mergeCartsData([before]).then((res) => res[0]),
		})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[`marketplace/carts/${before.userId}`, `marketplace/carts/${before.id}/${before.userId}`],
			await mergeCartsData([before]).then((res) => res[0]),
		)
	},
}
