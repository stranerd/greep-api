import { MethodEntity, MethodFromModel } from '@modules/payment'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const MethodDbChangeCallbacks: DbChangeCallbacks<MethodFromModel, MethodEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`payment/methods/${after.userId}`,
			`payment/methods/${after.id}/${after.userId}`,
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`payment/methods/${after.userId}`,
			`payment/methods/${after.id}/${after.userId}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`payment/methods/${before.userId}`,
			`payment/methods/${before.id}/${before.userId}`,
		], before)
	}
}