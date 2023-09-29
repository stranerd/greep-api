import { QueryParams } from 'equipped'
import { ChatToModel } from '../../data/models/chat'
import { IChatRepository } from '../irepositories/chat'

export class ChatsUseCase {
	private repository: IChatRepository

	constructor (repository: IChatRepository) {
		this.repository = repository
	}

	async add (data: ChatToModel) {
		return await this.repository.add(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { id: string, userId: string, data: Partial<ChatToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async delete (data: { id: string, userId: string }) {
		return await this.repository.delete(data.id, data.userId)
	}

	async markRead (input: { from: string, to: string }) {
		return await this.repository.markRead(input.from, input.to)
	}
}