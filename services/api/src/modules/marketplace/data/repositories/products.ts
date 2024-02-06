import { IProductRepository } from '@modules/marketplace/domain/i-repositories/product'
import Product from '../mongooseModels/product'
import { IProductToModel } from '../models'

export class ProductRepository implements IProductRepository {
	private static instance: ProductRepository
	// private mapper = new UserMapper()

	static getInstance(): ProductRepository {
		if (!ProductRepository.instance) ProductRepository.instance = new ProductRepository()
		return ProductRepository.instance
	}

	async create(product: IProductToModel) {
		const newCategory = await Product.create(product)
		await newCategory.save()
		return newCategory
	}

	async get() {
		return await Product.find({}).sort({ createdAt: -1 })
	}
}
