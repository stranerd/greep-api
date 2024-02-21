import { BaseEntity } from 'equipped'
import { NotificationData } from '../types'

export class NotificationEntity extends BaseEntity<NotificationConstructorArgs> {
	constructor(data: NotificationConstructorArgs) {
		super(data)
	}
}

type NotificationConstructorArgs = {
	id: string
	title: string
	body: string
	userId: string
	data: NotificationData
	sendEmail: boolean
	createdAt: number
	seen: boolean
	updatedAt: number
}
