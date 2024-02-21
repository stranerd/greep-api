import { EmbeddedUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { ChatEntity } from './chat'

export class ChatMetaEntity extends BaseEntity<ChatMetaConstructorArgs> {
	public users: Record<string, EmbeddedUser | null> = {}

	constructor(data: ChatMetaConstructorArgs) {
		super(data)
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
