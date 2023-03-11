import { CustomerEntity, CustomerFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const CustomerDbChangeCallbacks: DbChangeCallbacks<CustomerFromModel, CustomerEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`${after.driverId}`, `${after.id}/${after.driverId}`
		].map((c) => `users/customers/${c}`), after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`${after.driverId}`, `${after.id}/${after.driverId}`
		].map((c) => `users/customers/${c}`), after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`${before.driverId}`, `${before.id}/${before.driverId}`
		].map((c) => `users/customers/${c}`), before)
	}
}