import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { LikeFromModel } from '../../data/models/likes'
import { LikeEntity } from '../../domain/entities/likes'

export const LikeDbChangeCallbacks: DbChangeCallbacks<LikeFromModel, LikeEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/likes', `interactions/likes/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['interactions/likes', `interactions/likes/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/likes', `interactions/likes/${before.id}`], before)
	},
}
