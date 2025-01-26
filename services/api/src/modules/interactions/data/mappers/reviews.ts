import { BaseMapper } from 'equipped'
import { ReviewEntity } from '../../domain/entities/reviews'
import { ReviewFromModel, ReviewToModel } from '../models/reviews'

export class ReviewMapper extends BaseMapper<ReviewFromModel, ReviewToModel, ReviewEntity> {
	mapFrom(param: ReviewFromModel | null) {
		if (!param) return null
		return new ReviewEntity({
			id: param._id.toString(),
			entity: param.entity,
			user: param.user,
			rating: param.rating,
			message: param.message,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: ReviewEntity) {
		return {
			entity: param.entity,
			user: param.user,
			rating: param.rating,
			message: param.message,
		}
	}
}
