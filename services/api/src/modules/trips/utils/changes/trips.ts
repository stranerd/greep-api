import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { TripsUseCases } from '../..'
import { TripFromModel } from '../../data/models/trips'
import { TripEntity } from '../../domain/entities/trips'
import { TripStatus } from '../../domain/types'
import { ActivitiesUseCases, ActivityType } from '@modules/users'

export const TripDbChangeCallbacks: DbChangeCallbacks<TripFromModel, TripEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.customerId, after.driverId!, after.requestedDriverId!]
				.filter(Boolean)
				.map((c) => [`trips/trips/${c}`, `trips/trips/${after.id}/${c}`])
				.flat(),
			after,
		)

		if (after.driverId && after.status === TripStatus.created)
			await TripsUseCases.update({
				userId: after.customerId,
				id: after.id,
				data: {
					status: TripStatus.driverAssigned,
					data: {
						[TripStatus.driverAssigned]: { timestamp: Date.now() },
					},
				},
			})

		await ActivitiesUseCases.create({
			userId: after.customerId,
			data: {
				type: ActivityType.tripDiscount,
				tripId: after.id,
				discount: after.discount,
			},
		})
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated(
			[after.customerId, after.driverId!, after.requestedDriverId!]
				.filter(Boolean)
				.map((c) => [`trips/trips/${c}`, `trips/trips/${after.id}/${c}`])
				.flat(),
			after,
		)

		if (changes.status && after.status === TripStatus.cancelled)
			await ActivitiesUseCases.create({
				userId: after.customerId,
				data: {
					type: ActivityType.refundTripDiscount,
					tripId: after.id,
					discount: after.discount,
				},
			})

		if (changes.status && after.status === TripStatus.ended)
			await ActivitiesUseCases.create({
				userId: after.customerId,
				data: {
					type: ActivityType.completedTrip,
					tripId: after.id,
				},
			})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.customerId, before.driverId!, before.requestedDriverId!]
				.filter(Boolean)
				.map((c) => [`trips/trips/${c}`, `trips/trips/${before.id}/${c}`])
				.flat(),
			before,
		)
	},
}
