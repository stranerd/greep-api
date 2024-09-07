import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IPromotionRepository } from '../../domain/irepositories/promotions'
import { PromotionMapper } from '../mappers/promotions'
import { PromotionToModel } from '../models/promotions'
import { Promotion } from '../mongooseModels/promotions'

export class PromotionRepository implements IPromotionRepository {
	private static instance: PromotionRepository
	private mapper = new PromotionMapper()

	static getInstance(): PromotionRepository {
		if (!PromotionRepository.instance) PromotionRepository.instance = new PromotionRepository()
		return PromotionRepository.instance
	}

	async create(data: PromotionToModel) {
		const promotion = await new Promotion(data).save()
		return this.mapper.mapFrom(promotion)!
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Promotion, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async find(id: string) {
		const promotion = await Promotion.findById(id)
		return this.mapper.mapFrom(promotion)
	}

	async update(id: string, data: Partial<PromotionToModel>, userId: string) {
		const promotion = await Promotion.findOneAndUpdate({ _id: id, createdBy: userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(promotion)
	}

	async delete(id: string, userId: string) {
		const promotion = await Promotion.findOneAndDelete({ _id: id, createdBy: userId })
		return !!promotion
	}
}
