import { QueryParams } from 'equipped'
import { ICartRepository } from '../irepositories/carts'
import { AddToCartInput } from '../types'

export class CartUseCase {
	private repository: ICartRepository

	constructor(repository: ICartRepository) {
		this.repository = repository
	}

	async add(input: AddToCartInput) {
		return await this.repository.add(input)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async clear(data: { id: string; userId: string }) {
		return await this.repository.clear(data.id, data.userId)
	}
}
