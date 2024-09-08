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
			productIds: param.productIds,
			vendorIds: param.vendorIds,
			vendorType: param.vendorType,
			banner: param.banner,
			validity: param.validity,
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
			productIds: param.productIds,
			vendorIds: param.vendorIds,
			vendorType: param.vendorType,
			banner: param.banner,
			validity: param.validity,
			data: param.data,
			createdBy: param.createdBy,
		}
	}
}
