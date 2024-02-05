import { ICategoryRepository } from '../i-repositories/category'

export class CategoryUseCase {
	private repository: ICategoryRepository


	constructor (repository: ICategoryRepository) {
		this.repository = repository
	}

	async createCategory(category : string) {
		return await this.repository.createCategory(category)
	}

	async getCategories() {
		return await this.repository.getAllCategories()
	}
}