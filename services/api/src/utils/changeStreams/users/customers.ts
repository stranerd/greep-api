import { CustomerEntity, CustomerFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const CustomerChangeStreamCallbacks: ChangeStreamCallbacks<CustomerFromModel, CustomerEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(`users/customers/${after.driverId}`, after)
		await appInstance.listener.created(`users/customers/${after.driverId}/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(`users/customers/${after.driverId}`, after)
		await appInstance.listener.updated(`users/customers/${after.driverId}/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(`users/customers/${before.driverId}`, before)
		await appInstance.listener.deleted(`users/customers/${before.driverId}/${before.id}`, before)
	}
}