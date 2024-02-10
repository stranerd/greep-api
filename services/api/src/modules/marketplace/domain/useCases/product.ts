import { IProductToModel } from '@modules/marketplace/data/models/product'
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

	async update(id: string, product: IProductToModel) {
		return this.repository.update(id, product)
	}

	async delete(id: string) {
		return this.repository.delete(id)
	}
}
