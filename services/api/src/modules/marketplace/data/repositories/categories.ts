import { ICategoryRepository } from '@modules/marketplace/domain/i-repositories/category'
import Category from '../mongooseModels/category'
import { CategoryEntity } from '@modules/marketplace/domain/entities/categoryEntities'

export class CategoryRepository implements ICategoryRepository {
	private static instance: CategoryRepository
	// private mapper = new UserMapper()

	static getInstance(): CategoryRepository {
		if (!CategoryRepository.instance) CategoryRepository.instance = new CategoryRepository()
		return CategoryRepository.instance
	}

	async createCategory(category: string) {
		const newCategory = await Category.create({
			title: category,
		})
		await newCategory.save()
		return new CategoryEntity(newCategory)
	}

	async getAllCategories() {
		return await Category.find({})
	}

	// async get(category: string) {
	// 	return (await Category.findOne({ title: category }))
	// }
}
