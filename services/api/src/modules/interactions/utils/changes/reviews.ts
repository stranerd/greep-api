import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ReviewFromModel } from '../../data/models/reviews'
import { ReviewEntity } from '../../domain/entities/reviews'

export const ReviewDbChangeCallbacks: DbChangeCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/reviews', `interactions/reviews/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['interactions/reviews', `interactions/reviews/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/reviews', `interactions/reviews/${before.id}`], before)
	},
}
