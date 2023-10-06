import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { TripFromModel } from '../../data/models/trips'
import { TripEntity } from '../../domain/entities/trips'

export const TripDbChangeCallbacks: DbChangeCallbacks<TripFromModel, TripEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			after.driverId, `${after.id}/${after.driverId}`
		].map((c) => `trips/trips/${c}`), after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			after.driverId, `${after.id}/${after.driverId}`
		].map((c) => `trips/trips/${c}`), after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			before.driverId, `${before.id}/${before.driverId}`
		].map((c) => `trips/trips/${c}`), before)
	}
}