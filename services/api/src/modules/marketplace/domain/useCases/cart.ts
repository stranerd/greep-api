import { ICartToModel } from '@modules/marketplace/data/models/cart'
import { ICartRepository } from '../i-repositories/cart'

export class CartUseCase {
	private repository: ICartRepository

	constructor(repository: ICartRepository) {
		this.repository = repository
	}

	async create(product: ICartToModel, userId: string) {
		return await this.repository.create(product, userId)
	}

	async get(userId: string) {
		return await this.repository.get(userId)
	}

	async remove(product: string, userId: string) {
		return await this.repository.remove(product, userId)
	}
}
