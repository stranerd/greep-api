import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ChatMetaFromModel } from '../../data/models/chatMeta'
import { ChatMetaEntity } from '../../domain/entities/chatMeta'

export const ChatMetaDbChangeCallbacks: DbChangeCallbacks<ChatMetaFromModel, ChatMetaEntity> = {
	created: async ({ after }) => {
		await Promise.all(after.members.map(async (userId) => {
			await appInstance.listener.created([`messaging/chatMetas/${userId}`, `messaging/chatMetas/${after.id}/${userId}`], after)
		}))
	},
	updated: async ({ after }) => {
		await Promise.all(after.members.map(async (userId) => {
			await appInstance.listener.updated([`messaging/chatMetas/${userId}`, `messaging/chatMetas/${after.id}/${userId}`], after)
		}))
	},
	deleted: async ({ before }) => {
		await Promise.all(before.members.map(async (userId) => {
			await appInstance.listener.deleted([`messaging/chatMetas/${userId}`, `messaging/chatMetas/${before.id}/${userId}`], before)
		}))
	}
}