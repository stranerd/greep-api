type NotificationPushData = {
	type: 'notifications'
	data: {
		id: string
		data: Record<string, any>
	}
}

export type PushNotification = {
	userIds: string[],
	title: string
	body: string
	data: NotificationPushData
}