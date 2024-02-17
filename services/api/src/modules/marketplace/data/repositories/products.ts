import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IProductRepository } from '../../domain/irepositories/products'
import { ProductMapper } from '../mappers/products'
import { CategoryToModel } from '../models/categories'
import { ProductToModel } from '../models/products'
import { Product } from '../mongooseModels/products'

export class ProductRepository implements IProductRepository {
	private static instance: ProductRepository
	private mapper = new ProductMapper()

	static getInstance(): ProductRepository {
		if (!ProductRepository.instance) ProductRepository.instance = new ProductRepository()
		return ProductRepository.instance
	}

	async create(data: ProductToModel) {
		const product = await new Product(data).save()
		return this.mapper.mapFrom(product)!
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Product, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const product = await Product.findById(id)
		return this.mapper.mapFrom(product)
	}

	async update(id: string, data: Partial<CategoryToModel>, userId: string) {
		const product = await Product.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(product)
	}

	async delete(id: string, userId: string) {
		const product = await Product.findOneAndDelete({ _id: id, userId })
		return !!product
	}
}
