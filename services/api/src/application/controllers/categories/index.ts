import { CategoryUserCases } from '@modules/categories'
import { Request, Schema, validate } from 'equipped'

export class CategoryController {
	static async get (req: Request) {
		return await CategoryUserCases.getCategories()
	}
	
	static async create (req: Request) {
		const data = validate({
			category: Schema.string().min(2),
		}, { ...req.body })
		
		const category = CategoryUserCases.createCategory(data.category)
		return category
	}
}