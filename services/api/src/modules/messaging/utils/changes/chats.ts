import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'
import { ChatMetasUseCases } from '../..'
import { ChatFromModel } from '../../data/models/chat'
import { ChatEntity } from '../../domain/entities/chat'
import { sendPushNotification } from '@modules/notifications'

export const ChatDbChangeCallbacks: DbChangeCallbacks<ChatFromModel, ChatEntity> = {
	created: async ({ after }) => {
		await Promise.all(after.data.members.map(async (userId) => {
			await appInstance.listener.created([`messaging/chats/${userId}`, `messaging/chats/${after.id}/${userId}`], after)
		}))
		const body = after.media ? 'Shared a file' : after.body
		await sendPushNotification({
			userIds: after.data.members.filter((u) => u !== after.from),
			title: 'New message', body,
			data: {
				type: 'chats',
				data: { id: after.id, to: after.to, data: after.data }
			}
		})
	},
	updated: async ({ after, before, changes }) => {
		await Promise.all(after.data.members.map(async (userId) => {
			await appInstance.listener.updated([`messaging/chats/${userId}`, `messaging/chats/${after.id}/${userId}`], after)
		}))
		await ChatMetasUseCases.updateLastChat({ ...after, _id: after.id, id: undefined } as any)
		if (changes.media && before.media) await publishers.DELETEFILE.publish(before.media)
	},
	deleted: async ({ before }) => {
		await Promise.all(before.data.members.map(async (userId) => {
			await appInstance.listener.deleted([`messaging/chats/${userId}`, `messaging/chats/${before.id}/${userId}`], before)
		}))
		if (before.media) await publishers.DELETEFILE.publish(before.media)
	}
}