import { IProductRepository } from '@modules/marketplace/domain/i-repositories/product'
import { NotFoundError } from 'equipped'
import { IProductFromModel, IProductToModel } from '../models/product'
import Product from '../mongooseModels/product'
import { ProductEntity } from '@modules/marketplace/domain/entities/productEntities'

export class ProductRepository implements IProductRepository {
	private static instance: ProductRepository
	// private mapper = new UserMapper()

	static getInstance(): ProductRepository {
		if (!ProductRepository.instance) ProductRepository.instance = new ProductRepository()
		return ProductRepository.instance
	}

	async create(product: IProductToModel) {
		const newProduct = await Product.create(product)
		await newProduct.save()
		return new ProductEntity(newProduct)
	}

	async get() {
		return await Product.find({}).sort({ createdAt: -1 })
	}

	async update(id: string, product: IProductFromModel) {
		const _product = await Product.findById(id)
		if (_product) throw new NotFoundError('Product not found')

		const update = await Product.findByIdAndUpdate(id, { product })
		return new ProductEntity(update!)
	}

	async delete(id: string) {
		const product = await Product.findById(id)
		if (!product) throw new NotFoundError('Product not found')
		return await product.deleteOne()
	}
}
