import { CategoryUserCases } from '@modules/marketplace'
import { ProductUseCases } from '@modules/marketplace'
import { StorageUseCases } from '@modules/storage'
import { Request, Schema, validate } from 'equipped'

export class ProductController {
	static async get (req: Request) {
		return await ProductUseCases.get()
	}
	
	static async create (req: Request) {
		const data = validate({
			name: Schema.string().min(1),
			description: Schema.string().min(1),
			categories: Schema.array(Schema.string().min(1)),
			images:  Schema.array(Schema.file()),
			price: Schema.number(),
			quantity: Schema.number(),
		}, { ...req.body, images: req.files.images })
		
		const images = await Promise.all(data.images.map(async (file) => {
			const uploaded = await StorageUseCases.upload('uploads', file)
			return uploaded.link
		}))
		
		const newProduct = { ...data, images }
		const product = await ProductUseCases.create(newProduct)
		return product
	}
}