import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { TripEntity, TripFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'

export const TripChangeStreamCallbacks: ChangeStreamCallbacks<TripFromModel, TripEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`users/trips/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/trips/${after.managerId}`, after)
		await getSocketEmitter().emitCreated(`users/trips/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/trips/${after.id}/${after.managerId}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`users/trips/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/trips/${after.managerId}`, after)
		await getSocketEmitter().emitUpdated(`users/trips/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/trips/${after.id}/${after.managerId}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`users/trips/${before.driverId}`, before)
		await getSocketEmitter().emitDeleted(`users/trips/${before.managerId}`, before)
		await getSocketEmitter().emitDeleted(`users/trips/${before.id}/${before.driverId}`, before)
		await getSocketEmitter().emitDeleted(`users/trips/${before.id}/${before.managerId}`, before)
	}
}