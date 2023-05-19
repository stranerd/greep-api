import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { NotificationFromModel } from '../../data/models/notifications'
import { NotificationEntity } from '../../domain/entities/notifications'
import { sendPushNotification } from '../push'

export const NotificationDbChangeCallbacks: DbChangeCallbacks<NotificationFromModel, NotificationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`notifications/notifications/${after.userId}`,
			`notifications/notifications/${after.id}/${after.userId}`
		], after)

		await sendPushNotification({
			userIds: [after.userId],
			title: after.title, body: after.body,
			data: {
				type: 'notifications',
				data: { id: after.id, data: after.data }
			}
		})
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`notifications/notifications/${after.userId}`,
			`notifications/notifications/${after.id}/${after.userId}`
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`notifications/notifications/${before.userId}`,
			`notifications/notifications/${before.id}/${before.userId}`
		], before)
	}
}