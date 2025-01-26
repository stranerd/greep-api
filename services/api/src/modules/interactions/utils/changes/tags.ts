import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'
import { TagFromModel } from '../../data/models/tags'
import { TagEntity } from '../../domain/entities/tags'

export const TagDbChangeCallbacks: DbChangeCallbacks<TagFromModel, TagEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/tags', `interactions/tags/${after.id}`], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['interactions/tags', `interactions/tags/${after.id}`], { after, before })

		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/tags', `interactions/tags/${before.id}`], before)

		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	},
}
