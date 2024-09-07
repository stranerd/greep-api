import { PromotionEntity } from '@modules/marketplace/domain/entities/promotions'
import { BaseMapper } from 'equipped'
import { PromotionFromModel, PromotionToModel } from '../models/promotions'

export class PromotionMapper extends BaseMapper<PromotionFromModel, PromotionToModel, PromotionEntity> {
	mapFrom(param: PromotionFromModel | null) {
		if (!param) return null
		return new PromotionEntity({
			id: param._id,
			title: param.title,
			description: param.description,
			vendorIds: param.vendorIds,
			vendorType: param.vendorType,
			active: param.active,
			data: param.data,
			createdBy: param.createdBy,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: PromotionEntity) {
		return {
			title: param.title,
			description: param.description,
			vendorIds: param.vendorIds,
			vendorType: param.vendorType,
			active: param.active,
			data: param.data,
			createdBy: param.createdBy,
		}
	}
}
