import { ICartToModel } from '@modules/cart/data/types'
import { ICartRepository } from '../i-repositories/cart'

export class CartUseCase {
	private repository: ICartRepository

	constructor (repository: ICartRepository) {
		this.repository = repository
	}

	async create(product: ICartToModel) {
		return await this.repository.create(product)
	}	

	async get(userId: string) {
		return await this.repository.get(userId)
	}
}