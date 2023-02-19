import { TripEntity, TripFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const TripDbChangeCallbacks: DbChangeCallbacks<TripFromModel, TripEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(`users/trips/${after.driverId}`, after)
		await appInstance.listener.created(`users/trips/${after.managerId}`, after)
		await appInstance.listener.created(`users/trips/${after.id}/${after.driverId}`, after)
		await appInstance.listener.created(`users/trips/${after.id}/${after.managerId}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(`users/trips/${after.driverId}`, after)
		await appInstance.listener.updated(`users/trips/${after.managerId}`, after)
		await appInstance.listener.updated(`users/trips/${after.id}/${after.driverId}`, after)
		await appInstance.listener.updated(`users/trips/${after.id}/${after.managerId}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(`users/trips/${before.driverId}`, before)
		await appInstance.listener.deleted(`users/trips/${before.managerId}`, before)
		await appInstance.listener.deleted(`users/trips/${before.id}/${before.driverId}`, before)
		await appInstance.listener.deleted(`users/trips/${before.id}/${before.managerId}`, before)
	}
}