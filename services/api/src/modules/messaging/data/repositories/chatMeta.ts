import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IChatMetaRepository } from '../../domain/irepositories/chatMeta'
import { ChatMetaMapper } from '../mappers/chatMeta'
import { ChatFromModel } from '../models/chat'
import { ChatMeta } from '../mongooseModels/chatMeta'

export class ChatMetaRepository implements IChatMetaRepository {
	private static instance: ChatMetaRepository
	private mapper = new ChatMetaMapper()

	private constructor() {
		this.mapper = new ChatMetaMapper()
	}

	static getInstance() {
		if (!ChatMetaRepository.instance) ChatMetaRepository.instance = new ChatMetaRepository()
		return ChatMetaRepository.instance
	}

	async find(id: string) {
		const chat = await ChatMeta.findById(id)
		return this.mapper.mapFrom(chat)
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(ChatMeta, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async updateLastChat(chat: ChatFromModel) {
		await ChatMeta.updateMany({ 'last._id': chat._id }, { $set: { last: chat } })
	}

	async delete(id: string, userId: string) {
		const chat = await ChatMeta.findOneAndDelete({ _id: id, members: userId })
		return !!chat
	}
}
