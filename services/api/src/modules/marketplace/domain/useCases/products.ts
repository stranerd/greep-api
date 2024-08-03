import { QueryParams } from 'equipped'
import { ProductToModel } from '../../data/models/products'
import { IProductRepository } from '../irepositories/products'
import { ProductMeta } from '../types'

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

	async updateUserBio(user: ProductToModel['user']) {
		return await this.repository.updateUserBio(user)
	}

	async updateMeta(data: { ids: string[]; property: ProductMeta; value: 1 | -1 }) {
		return await this.repository.updateMeta(data.ids, data.property, data.value)
	}

	async updateRatings(input: { id: string; ratings: number; add: boolean }) {
		return await this.repository.updateRatings(input.id, input.ratings, input.add)
	}
}
