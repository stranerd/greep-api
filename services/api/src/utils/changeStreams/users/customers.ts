import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { CustomerEntity, CustomerFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'

export const CustomerChangeStreamCallbacks: ChangeStreamCallbacks<CustomerFromModel, CustomerEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`users/customers/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/customers/${after.driverId}/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`users/customers/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/customers/${after.driverId}/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`users/customers/${before.driverId}`, before)
		await getSocketEmitter().emitDeleted(`users/customers/${before.driverId}/${before.id}`, before)
	}
}