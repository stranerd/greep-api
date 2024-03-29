import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ChatMetaFromModel } from '../../data/models/chatMeta'
import { ChatMetaEntity } from '../../domain/entities/chatMeta'
import { mergeChatMetasWithUserBios } from '..'

export const ChatMetaDbChangeCallbacks: DbChangeCallbacks<ChatMetaFromModel, ChatMetaEntity> = {
	created: async ({ after }) => {
		await Promise.all(
			after.members.map(async (userId) => {
				await appInstance.listener.created(
					[`messaging/chatMetas/${userId}`, `messaging/chatMetas/${after.id}/${userId}`],
					(await mergeChatMetasWithUserBios([after]))[0],
				)
			}),
		)
	},
	updated: async ({ after }) => {
		await Promise.all(
			after.members.map(async (userId) => {
				await appInstance.listener.updated(
					[`messaging/chatMetas/${userId}`, `messaging/chatMetas/${after.id}/${userId}`],
					(await mergeChatMetasWithUserBios([after]))[0],
				)
			}),
		)
	},
	deleted: async ({ before }) => {
		await Promise.all(
			before.members.map(async (userId) => {
				await appInstance.listener.deleted(
					[`messaging/chatMetas/${userId}`, `messaging/chatMetas/${before.id}/${userId}`],
					(await mergeChatMetasWithUserBios([before]))[0],
				)
			}),
		)
	},
}
