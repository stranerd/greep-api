import { QueryParams } from 'equipped'
import { ProductToModel } from '../../data/models/products'
import { IProductRepository } from '../irepositories/products'

export class ProductUseCase {
	private repository: IProductRepository

	constructor(repository: IProductRepository) {
		this.repository = repository
	}

	async create(product: ProductToModel) {
		return await this.repository.create(product)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async update(input: { id: string; data: Partial<ProductToModel>; userId: string }) {
		return this.repository.update(input.id, input.data, input.userId)
	}

	async delete(input: { id: string; userId: string }) {
		return this.repository.delete(input.id, input.userId)
	}

	async updateUserBio(user: ProductToModel['user']) {
		return await this.repository.updateUserBio(user)
	}
}
