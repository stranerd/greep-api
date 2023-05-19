import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { TripFromModel } from '../../data/models/trips'
import { TripEntity } from '../../domain/entities/trips'

export const TripDbChangeCallbacks: DbChangeCallbacks<TripFromModel, TripEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			after.managerId, after.driverId, `${after.id}/${after.managerId}`, `${after.id}/${after.driverId}`
		].map((c) => `users/trips/${c}`), after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			after.managerId, after.driverId, `${after.id}/${after.managerId}`, `${after.id}/${after.driverId}`
		].map((c) => `users/trips/${c}`), after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			before.managerId, before.driverId, `${before.id}/${before.managerId}`, `${before.id}/${before.driverId}`
		].map((c) => `users/trips/${c}`), before)
	}
}