import { QueryParams, QueryResults } from 'equipped'
import { ChatFromModel } from '../../data/models/chat'
import { ChatMetaToModel } from '../../data/models/chatMeta'
import { ChatMetaEntity } from '../entities/chatMeta'

export interface IChatMetaRepository {
	create: (data: ChatMetaToModel) => Promise<ChatMetaEntity>
	find: (id: string) => Promise<ChatMetaEntity | null>
	get: (query: QueryParams) => Promise<QueryResults<ChatMetaEntity>>
	updateLastChat: (chat: ChatFromModel) => Promise<void>
	delete: (id: string, userId: string) => Promise<boolean>
	assignSupport: (id: string, userId: string) => Promise<ChatMetaEntity | null>
}
