import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { RequestFromModel } from '../../data/models/requests'
import { RequestEntity } from '../../domain/entities/requests'

export const RequestDbChangeCallbacks: DbChangeCallbacks<RequestFromModel, RequestEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`payment/requests/${after.from}`, `payment/requests/${after.to}`,
			`payment/requests/${after.id}/${after.from}`, `payment/requests/${after.id}/${after.to}`,
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`payment/requests/${after.from}`, `payment/requests/${after.to}`,
			`payment/requests/${after.id}/${after.from}`, `payment/requests/${after.id}/${after.to}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`payment/requests/${before.from}`, `payment/requests/${before.to}`,
			`payment/requests/${before.id}/${before.from}`, `payment/requests/${before.id}/${before.to}`,
		], before)
	}
}