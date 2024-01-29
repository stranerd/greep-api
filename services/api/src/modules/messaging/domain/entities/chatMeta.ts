import { EmbeddedUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { ChatEntity } from './chat'

export class ChatMetaEntity extends BaseEntity {
	public readonly id: string
	public readonly members: string[]
	public readonly last: ChatEntity | null
	public readonly createdAt: number
	public readonly updatedAt: number
	public readonly readAt: Record<string, number>

	public users: Record<string, EmbeddedUser | null> = {}

	constructor({ id, members, last, createdAt, updatedAt, readAt }: ChatMetaConstructorArgs) {
		super()
		this.id = id
		this.members = members
		this.last = last
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.readAt = readAt
	}

	withUsers(users: Record<string, EmbeddedUser | null>) {
		this.users = users
		return this
	}
}

type ChatMetaConstructorArgs = {
	id: string
	members: string[]
	last: ChatEntity | null
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
}
