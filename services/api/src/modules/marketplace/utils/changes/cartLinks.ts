import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { mergeCartLinksData } from '..'
import { CartFromModel } from '../../data/models/carts'
import { CartEntity } from '../../domain/entities/carts'

export const CartLinkDbChangeCallbacks: DbChangeCallbacks<CartFromModel, CartEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[`marketplace/cartLinks`, `marketplace/cartLinks/${after.id}`],
			await mergeCartLinksData([after]).then((res) => res[0]),
		)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated([`marketplace/cartLinks`, `marketplace/cartLinks/${after.id}`], {
			after: await mergeCartLinksData([after]).then((res) => res[0]),
			before: await mergeCartLinksData([before]).then((res) => res[0]),
		})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[`marketplace/cartLinks`, `marketplace/cartLinks/${before.id}`],
			await mergeCartLinksData([before]).then((res) => res[0]),
		)
	},
}
