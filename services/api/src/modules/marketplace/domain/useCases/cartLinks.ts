import { QueryParams } from 'equipped'
import { CartLinkToModel } from '../../data/models/cartLinks'
import { ICartLinkRepository } from '../irepositories/cartLinks'

export class CartLinkUseCase {
	private repository: ICartLinkRepository

	constructor(repository: ICartLinkRepository) {
		this.repository = repository
	}

	async create(data: CartLinkToModel) {
		return await this.repository.create(data)
	}

	async update(data: { id: string; userId: string; data: Partial<CartLinkToModel> }) {
		return await this.repository.update(data.id, data.userId, data.data)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
