import { ChatFromModel } from './chat'

export interface ChatMetaFromModel extends ChatMetaToModel {
	_id: string
	createdAt: number
	updatedAt: number
	readAt: Record<string, number>
	last: ChatFromModel | null
}

export interface ChatMetaToModel {
	members: string[]
}
