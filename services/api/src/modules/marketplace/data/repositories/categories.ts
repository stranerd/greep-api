import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ICategoryRepository } from '../../domain/irepositories/categories'
import { CategoryMapper } from '../mappers/categories'
import { CategoryToModel } from '../models/categories'
import { Category } from '../mongooseModels/categories'

export class CategoryRepository implements ICategoryRepository {
	private static instance: CategoryRepository
	private mapper = new CategoryMapper()

	static getInstance(): CategoryRepository {
		if (!CategoryRepository.instance) CategoryRepository.instance = new CategoryRepository()
		return CategoryRepository.instance
	}

	async create(data: CategoryToModel) {
		const category = await new Category(data).save()
		return this.mapper.mapFrom(category)!
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Category, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const category = await Category.findById(id)
		return this.mapper.mapFrom(category)
	}

	async update(id: string, data: Partial<CategoryToModel>) {
		const category = await Category.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
		return this.mapper.mapFrom(category)
	}

	async delete(id: string) {
		const category = await Category.findOneAndDelete({ _id: id })
		return !!category
	}
}
