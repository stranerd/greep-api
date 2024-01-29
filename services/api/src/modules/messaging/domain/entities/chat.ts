import { BaseEntity } from 'equipped'
import { ChatData, Media } from '../types'

export class ChatEntity extends BaseEntity {
	public readonly id: string
	public readonly from: string
	public readonly to: string
	public readonly data: ChatData
	public readonly body: string
	public readonly media: Media | null
	public readonly links: { original: string; normalized: string }[]
	public readonly createdAt: number
	public readonly updatedAt: number
	public readonly readAt: Record<string, number>

	constructor({ id, from, to, data, body, links, media, createdAt, updatedAt, readAt }: ChatConstructorArgs) {
		super()
		this.id = id
		this.from = from
		this.to = to
		this.data = data
		this.body = body
		this.links = links
		this.media = media
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.readAt = readAt
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
