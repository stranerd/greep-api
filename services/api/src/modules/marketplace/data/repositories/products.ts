import { appInstance } from '@utils/environment'
import { updateRatings } from '@utils/types'
import { QueryParams } from 'equipped'
import { IProductRepository } from '../../domain/irepositories/products'
import { ProductMeta } from '../../domain/types'
import { ProductMapper } from '../mappers/products'
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

	async update(id: string, data: Partial<ProductToModel>, userId: string) {
		const product = await Product.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(product)
	}

	async updateUserBio(user: ProductToModel['user']) {
		const products = await Product.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!products.acknowledged
	}

	async updateMeta(ids: string[], property: ProductMeta, value: 1 | -1) {
		await Product.updateMany(
			{ _id: { $in: ids } },
			{
				$inc: { [`meta.${property}`]: value, [`meta.${ProductMeta.total}`]: value },
			},
		)
	}

	async updateRatings(id: string, rating: number, add: boolean) {
		let res = false
		await Product.collection.conn.transaction(async (session) => {
			const product = await Product.findById(id, {}, { session })
			if (!product) return res
			res = !!(await Product.findByIdAndUpdate(id, { $set: { ratings: updateRatings(product.ratings, rating, add) } }, { session }))
			return res
		})
		return res
	}
}
