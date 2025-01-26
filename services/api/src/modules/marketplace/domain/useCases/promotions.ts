import { QueryParams } from 'equipped'
import { PromotionToModel } from '../../data/models/promotions'
import { IPromotionRepository } from '../irepositories/promotions'

export class PromotionUseCase {
	private repository: IPromotionRepository

	constructor(repository: IPromotionRepository) {
		this.repository = repository
	}

	async create(promotion: PromotionToModel) {
		return await this.repository.create(promotion)
	}

	async get(query: QueryParams) {
		return await this.repository.get(query)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async update(input: { id: string; data: Partial<PromotionToModel>; userId: string }) {
		return this.repository.update(input.id, input.data, input.userId)
	}

	async delete(input: { id: string; userId: string }) {
		return this.repository.delete(input.id, input.userId)
	}
}
