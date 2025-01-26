import { mergeWithUsers } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ChatMetaFromModel } from '../../data/models/chatMeta'
import { ChatMetaEntity } from '../../domain/entities/chatMeta'

export const ChatMetaDbChangeCallbacks: DbChangeCallbacks<ChatMetaFromModel, ChatMetaEntity> = {
	created: async ({ after }) => {
		await Promise.all(
			after.members.map(async (userId) => {
				await appInstance.listener.created(
					[`messaging/chatMetas/${userId}`, `messaging/chatMetas/${after.id}/${userId}`],
					(await mergeWithUsers([after], (e) => e.members))[0],
				)
			}),
		)
	},
	updated: async ({ after, before }) => {
		await Promise.all(
			after.members.map(async (userId) => {
				await appInstance.listener.updated([`messaging/chatMetas/${userId}`, `messaging/chatMetas/${after.id}/${userId}`], {
					after: (await mergeWithUsers([after], (e) => e.members))[0],
					before: (await mergeWithUsers([before], (e) => e.members))[0],
				})
			}),
		)
	},
	deleted: async ({ before }) => {
		await Promise.all(
			before.members.map(async (userId) => {
				await appInstance.listener.deleted(
					[`messaging/chatMetas/${userId}`, `messaging/chatMetas/${before.id}/${userId}`],
					(await mergeWithUsers([before], (e) => e.members))[0],
				)
			}),
		)
	},
}
