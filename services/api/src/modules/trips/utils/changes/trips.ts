import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { TripsUseCases } from '../..'
import { TripFromModel } from '../../data/models/trips'
import { TripEntity } from '../../domain/entities/trips'
import { TripStatus } from '../../domain/types'

export const TripDbChangeCallbacks: DbChangeCallbacks<TripFromModel, TripEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			after.customerId, after.driverId!,
		].filter(Boolean)
			.map((c) => [`trips/trips/${c}`, `trips/trips/${after.id}/${c}`]).flat(), after)

		if (after.driverId && after.status === TripStatus.created) await TripsUseCases.update({
			userId: after.customerId,
			id: after.id,
			data: {
				status: TripStatus.driverAssigned,
				data: {
					[TripStatus.driverAssigned]: { timestamp: Date.now() }
				}
			}
		})
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			after.customerId, after.driverId!,
		].filter(Boolean)
			.map((c) => [`trips/trips/${c}`, `trips/trips/${after.id}/${c}`]).flat(), after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			before.customerId, before.driverId!,
		].filter(Boolean)
			.map((c) => [`trips/trips/${c}`, `trips/trips/${before.id}/${c}`]).flat(), before)
	}
}