import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IChatMetaRepository } from '../../domain/irepositories/chatMeta'
import { ChatType } from '../../domain/types'
import { ChatMetaMapper } from '../mappers/chatMeta'
import { ChatFromModel } from '../models/chat'
import { ChatMetaFromModel, ChatMetaToModel } from '../models/chatMeta'
import { ChatMeta } from '../mongooseModels/chatMeta'
import { Chat } from '../mongooseModels/chat'

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

	async create(data: ChatMetaToModel) {
		const { data: dataType, members, ...rest } = data
		const chat = await ChatMeta.findOneAndUpdate(
			{
				data: dataType,
				members: { $all: members.map((val) => ({ $elemMatch: { $eq: val } })) },
			},
			{ $setOnInsert: data, $set: rest },
			{ upsert: true, new: true },
		)
		return this.mapper.mapFrom(chat)!
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

	async assignSupport(id: string, userId: string) {
		let res = null as ChatMetaFromModel | null
		await ChatMeta.collection.conn.transaction(async (session) => {
			const chat = await ChatMeta.findOneAndUpdate(
				{
					_id: id,
					'data.type': ChatType.support,
					'members.1': { $exists: false },
				},
				{ $push: { members: userId } },
				{ new: true, session },
			)
			if (chat)
				await Chat.updateMany(
					{ to: chat._id, 'data.type': ChatType.support },
					{
						$set: { 'data.members': chat.members },
					},
					{ session },
				)
			res = chat
			return chat
		})
		return this.mapper.mapFrom(res)!
	}
}
