import { QueryParams, QueryResults } from 'equipped'
import { ChatToModel } from '../../data/models/chat'
import { ChatEntity } from '../entities/chat'

export interface IChatRepository {
	add: (data: ChatToModel) => Promise<ChatEntity>,
	get: (query: QueryParams) => Promise<QueryResults<ChatEntity>>
	find: (id: string) => Promise<ChatEntity | null>
	update: (id: string, userId: string, data: Partial<ChatToModel>) => Promise<ChatEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	markRead: (from: string, to: string) => Promise<boolean>
}
