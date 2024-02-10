import { CategoryUserCases } from '@modules/marketplace/'
import { Request, Schema, validate } from 'equipped'

export class CategoryController {
	static async get(_req: Request) {
		return await CategoryUserCases.getCategories()
	}

	static async create(req: Request) {
		const data = validate(
			{
				title: Schema.string().min(2),
			},
			{ ...req.body },
		)

		const category = CategoryUserCases.createCategory(data.title)
		return category
	}
}
