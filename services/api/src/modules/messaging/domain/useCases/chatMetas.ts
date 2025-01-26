import { QueryParams } from 'equipped'
import { ChatFromModel } from '../../data/models/chat'
import { ChatMetaToModel } from '../../data/models/chatMeta'
import { IChatMetaRepository } from '../irepositories/chatMeta'

export class ChatMetasUseCase {
	private repository: IChatMetaRepository

	constructor(repository: IChatMetaRepository) {
		this.repository = repository
	}

	async create(data: ChatMetaToModel) {
		return await this.repository.create(data)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateLastChat(chat: ChatFromModel) {
		return await this.repository.updateLastChat(chat)
	}

	async delete(data: { id: string; userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}

	async assignSupport(data: { id: string; userId: string }) {
		return await this.repository.assignSupport(data.id, data.userId)
	}
}
