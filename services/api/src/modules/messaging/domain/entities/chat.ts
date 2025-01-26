import { BaseEntity } from 'equipped'
import { ChatData, Media } from '../types'

export class ChatEntity extends BaseEntity<ChatConstructorArgs> {
	constructor(data: ChatConstructorArgs) {
		super(data)
	}
}

type ChatConstructorArgs = {
	id: string
	from: string
	to: string
	data: ChatData
	body: string
	media: Media | null
	links: { original: string; normalized: string }[]
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
}
