import { QueryParams } from 'equipped'
import { IChatRepository } from '../../domain/irepositories/chat'
import { ChatMapper } from '../mappers/chat'
import { ChatFromModel, ChatToModel } from '../models/chat'
import { Chat } from '../mongooseModels/chat'
import { ChatMeta } from '../mongooseModels/chatMeta'
import { appInstance } from '@utils/environment'

const getChatMetaCondition = (from: string, to: string) => ({
	$and: [
		{ members: from },
		{ members: to },
	]
})

export class ChatRepository implements IChatRepository {
	private static instance: ChatRepository
	private mapper: ChatMapper

	private constructor () {
		this.mapper = new ChatMapper()
	}

	static getInstance () {
		if (!ChatRepository.instance) ChatRepository.instance = new ChatRepository()
		return ChatRepository.instance
	}

	async add (data: ChatToModel) {
		let res = null as ChatFromModel | null
		await Chat.collection.conn.transaction(async (session) => {
			const createdAt = Date.now()
			const chat = await new Chat({
				...data, createdAt, updatedAt: createdAt,
				readAt: { [data.from]: createdAt }
			}).save({ session })
			await ChatMeta.findOneAndUpdate(
				getChatMetaCondition(data.from, data.to),
				{ $set: { last: chat }, $max: { [`readAt.${data.from}`]: createdAt } },
				{ session })
			res = chat
			return chat
		})
		return this.mapper.mapFrom(res)!
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Chat, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (id: string) {
		const chat = await Chat.findById(id)
		return this.mapper.mapFrom(chat)
	}

	async update (id: string, userId: string, data: Partial<ChatToModel>) {
		const chat = await Chat.findOneAndUpdate({
			_id: id, from: userId
		}, { $set: data }, { new: true })
		return this.mapper.mapFrom(chat)
	}

	async markRead (from: string, to: string) {
		const readAt = Date.now()
		let res = false
		await Chat.collection.conn.transaction(async (session) => {
			const chatMeta = await ChatMeta.findOneAndUpdate(
				getChatMetaCondition(from, to),
				{ $max: { [`readAt.${from}`]: readAt } },
				{ session }
			)
			if (!chatMeta) return false
			await Chat.updateMany(
				{ to, [`readAt.${from}`]: null },
				{ $set: { [`readAt.${from}`]: readAt } },
				{ session }
			)
			res = true
			return true
		})
		return res
	}

	async delete (id: string, userId: string) {
		const chat = await Chat.findOneAndDelete({ _id: id, from: userId })
		return !!chat
	}
}
