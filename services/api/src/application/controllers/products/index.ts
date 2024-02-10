import { ProductUseCases } from '@modules/marketplace'
import { StorageUseCases } from '@modules/storage'
import { BadRequestError, Request, Schema, validate } from 'equipped'

export class ProductController {
	static async get(_req: Request) {
		return await ProductUseCases.get()
	}

	static async create(req: Request) {
		const data = validate(
			{
				name: Schema.string().min(1),
				description: Schema.string().min(1),
				categories: Schema.array(Schema.string().min(1)),
				images: Schema.array(Schema.file()),
				price: Schema.number(),
				quantity: Schema.number(),
			},
			{ ...req.body, images: req.files.images },
		)

		const images = await Promise.all(
			data.images.map(async (file) => {
				const uploaded = await StorageUseCases.upload('uploads', file)
				return uploaded
			}),
		)

		const newProduct = { ...data, images }
		const product = await ProductUseCases.create(newProduct)
		return product
	}

	static async update(req: Request) {
		const id = req.params.id
		const data = validate(
			{
				name: Schema.string().min(1).optional(),
				description: Schema.string().min(1).optional(),
				categories: Schema.array(Schema.string().min(1)).optional(),
				images: Schema.array(Schema.file()).optional(),
				price: Schema.number().optional(),
				quantity: Schema.number().optional(),
			},
			{ ...req.body, images: req.files.images },
		)

		const newProduct: any = { ...data }
		if (data.images && data.images.length > 0) {
			const images = await Promise.all(
				data.images.map(async (file) => {
					const uploaded = await StorageUseCases.upload('uploads', file)
					return uploaded
				}),
			)

			Object.assign(newProduct, { images })
		}

		const product = await ProductUseCases.update(id, newProduct)
		return product
	}

	static async delete(req: Request) {
		const id = req.params.id
		if (!id) throw new BadRequestError('Product ID is required')

		const product = await ProductUseCases.delete(id)
		return product
	}
}
