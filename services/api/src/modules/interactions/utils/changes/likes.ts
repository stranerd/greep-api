import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { LikeFromModel } from '../../data/models/likes'
import { LikeEntity } from '../../domain/entities/likes'

export const LikeDbChangeCallbacks: DbChangeCallbacks<LikeFromModel, LikeEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.user.id, after.entity.userId]
				.map((uid) => [`interactions/likes/${uid}`, `interactions/likes/${after.id}/${uid}`])
				.flat(),
			after,
		)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[after.user.id, after.entity.userId]
				.map((uid) => [`interactions/likes/${uid}`, `interactions/likes/${after.id}/${uid}`])
				.flat(),
			{ after, before },
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.user.id, before.entity.userId]
				.map((uid) => [`interactions/likes/${uid}`, `interactions/likes/${before.id}/${uid}`])
				.flat(),
			before,
		)
	},
}
