import { QueryParams } from 'equipped'
import { CategoryToModel } from '../../data/models/categories'
import { ICategoryRepository } from '../irepositories/categories'

export class CategoryUseCase {
	private repository: ICategoryRepository

	constructor(repository: ICategoryRepository) {
		this.repository = repository
	}

	async create(data: CategoryToModel) {
		return await this.repository.create(data)
	}

	async update(input: { id: string; data: Partial<CategoryToModel> }) {
		return await this.repository.update(input.id, input.data)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
