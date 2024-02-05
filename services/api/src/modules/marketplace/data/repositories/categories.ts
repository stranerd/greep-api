import { ICategoryRepository, } from '@modules/marketplace/domain/i-repositories/category'
import Category from '../mongooseModels/category'


export class CategoryRepository implements ICategoryRepository {    
	private static instance: CategoryRepository
	// private mapper = new UserMapper()

	static getInstance (): CategoryRepository {
		if (!CategoryRepository.instance) CategoryRepository.instance = new CategoryRepository()
		return CategoryRepository.instance
	}

	async createCategory(category: string) {
		const newCategory = await Category.create({
			title: category,
		})
		await newCategory.save()
		return newCategory
	}

	async getAllCategories() {
		return await Category.find({})
	}

	async get(category) {
		return await Category.findOne({title: category});
	}
}