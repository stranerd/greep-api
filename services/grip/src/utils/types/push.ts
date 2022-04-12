type NotificationData = {
	type: 'notifications'
	data: {
		id: string
		action: string
		data: Record<string, any>
	}
}

export type PushNotification = {
	userIds: string[],
	title: string
	body: string
	data: NotificationData
}