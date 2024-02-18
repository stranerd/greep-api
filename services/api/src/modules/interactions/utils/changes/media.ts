import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'
import { MediaFromModel } from '../../data/models/media'
import { MediaEntity } from '../../domain/entities/media'

export const MediaDbChangeCallbacks: DbChangeCallbacks<MediaFromModel, MediaEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/media', `interactions/media/${after.id}`], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['interactions/medias', `interactions/media/${after.id}`], after)
		if (changes.file && before.file) await publishers.DELETEFILE.publish(before.file)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/media', `interactions/media/${before.id}`], before)
		await publishers.DELETEFILE.publish(before.file)
	},
}
