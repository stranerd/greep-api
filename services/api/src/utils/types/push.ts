type NotificationPushData = {
	type: 'notifications'
	data: {
		id: string
		data: Record<string, any>
	}
}

type ChatPushData = {
	type: 'chats'
	data: {
		id: string
		to: string
		data: Record<string, any>
	}
}

export type PushNotification = {
	userIds: string[],
	title: string
	body: string
	data: NotificationPushData | ChatPushData
}