import { QueryParams, QueryResults } from 'equipped'
import { ChatFromModel } from '../../data/models/chat'
import { ChatMetaEntity } from '../entities/chatMeta'

export interface IChatMetaRepository {
	find: (id: string) => Promise<ChatMetaEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<ChatMetaEntity>>
	updateLastChat: (chat: ChatFromModel) => Promise<void>
	delete: (id: string, userId: string) => Promise<boolean>
}
