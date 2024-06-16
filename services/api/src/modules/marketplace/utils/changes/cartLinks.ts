import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { CartFromModel } from '../../data/models/carts'
import { CartEntity } from '../../domain/entities/carts'

export const CartLinkDbChangeCallbacks: DbChangeCallbacks<CartFromModel, CartEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([`marketplace/cartLinks`, `marketplace/cartLinks/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([`marketplace/cartLinks`, `marketplace/cartLinks/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([`marketplace/cartLinks`, `marketplace/cartLinks/${before.id}`], before)
	},
}
