import { CategoryUserCases } from '@modules/categories'
import { ProductUseCases } from '@modules/products'
import { Request, Schema, validate } from 'equipped'

export class ProductController {
	static async get (req: Request) {
		return await CategoryUserCases.getCategories()
	}
	
	static async create (req: Request) {
		const data = validate({
			name: Schema.string().min(1),
			description: Schema.string().min(1),
			categories: Schema.array(Schema.string().min(1)),
			images: Schema.array(Schema.string().min(1)),
			price: Schema.number(),
			quantity: Schema.number(),
		}, { ...req.body })
		
		const product = await ProductUseCases.create(data)
		return product
	}
}