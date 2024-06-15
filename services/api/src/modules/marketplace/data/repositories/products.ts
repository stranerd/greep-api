import { appInstance } from '@utils/environment'
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

	async delete(id: string, userId: string) {
		const product = await Product.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!product
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

	async updateRatings(id: string, ratings: number, add: boolean) {
		let res = false
		await Product.collection.conn.transaction(async (session) => {
			const quiz = await Product.findById(id, {}, { session })
			if (!quiz) return res
			quiz.ratings.total += (add ? 1 : -1) * ratings
			quiz.ratings.count += add ? 1 : -1
			quiz.ratings.avg = Number((quiz.ratings.total / quiz.ratings.count).toFixed(2))
			res = !!(await quiz.save({ session }))
			return res
		})
		return res
	}

	async updateLikes(id: string, userId: string, like: boolean | undefined) {
		const product = await Product.findByIdAndUpdate(
			id,
			{
				[like !== undefined ? '$set' : '$unset']: { [`likes.${userId}`]: like ?? '' },
			},
			{ new: true },
		)
		return !!product
	}
}
