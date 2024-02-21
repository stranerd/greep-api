import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { TagFromModel } from '../../data/models/tags'
import { TagEntity } from '../../domain/entities/tags'

export const TagDbChangeCallbacks: DbChangeCallbacks<TagFromModel, TagEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/tags', `interactions/tags/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['interactions/tags', `interactions/tags/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/tags', `interactions/tags/${before.id}`], before)
	},
}
