import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { DeliveryFromModel } from '../../data/models/deliveries'
import { DeliveryEntity } from '../../domain/entities/deliveries'

export const DeliveryDbChangeCallbacks: DbChangeCallbacks<DeliveryFromModel, DeliveryEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[
				`marketplace/deliveries/${after.userId}`,
				`marketplace/deliveries/${after.id}/${after.userId}`,
				...(after.driverId
					? [`marketplace/deliveries/${after.driverId}`, `marketplace/deliveries/${after.id}/${after.driverId}`]
					: []),
			],
			after,
		)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(
			[
				`marketplace/deliveries/${after.userId}`,
				`marketplace/deliveries/${after.id}/${after.userId}`,
				...(after.driverId
					? [`marketplace/deliveries/${after.driverId}`, `marketplace/deliveries/${after.id}/${after.driverId}`]
					: []),
			],
			after,
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[
				`marketplace/deliveries/${before.userId}`,
				`marketplace/deliveries/${before.id}/${before.userId}`,
				...(before.driverId
					? [`marketplace/deliveries/${before.driverId}`, `marketplace/deliveries/${before.id}/${before.driverId}`]
					: []),
			],
			before,
		)
	},
}
