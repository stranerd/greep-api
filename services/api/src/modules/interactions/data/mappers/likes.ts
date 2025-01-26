import { BaseMapper } from 'equipped'
import { LikeEntity } from '../../domain/entities/likes'
import { LikeFromModel, LikeToModel } from '../models/likes'

export class LikeMapper extends BaseMapper<LikeFromModel, LikeToModel, LikeEntity> {
	mapFrom(param: LikeFromModel | null) {
		if (!param) return null
		return new LikeEntity({
			id: param._id.toString(),
			value: param.value,
			entity: param.entity,
			user: param.user,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: LikeEntity) {
		return {
			value: param.value,
			entity: param.entity,
			user: param.user,
		}
	}
}
