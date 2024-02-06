import { IProductToModel } from '@modules/marketplace/data/models'
import { IProductRepository } from '../i-repositories/product'

export class ProductUseCase {
	private repository: IProductRepository

	constructor(repository: IProductRepository) {
		this.repository = repository
	}

	async create(product: IProductToModel) {
		return await this.repository.create(product)
	}

	async get() {
		return await this.repository.get()
	}
}
