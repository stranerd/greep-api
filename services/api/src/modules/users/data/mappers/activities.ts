import { BaseMapper } from 'equipped'
import { ActivityEntity } from '../../domain/entities/activities'
import { ActivityFromModel, ActivityToModel } from '../models/activities'

export class ActivityMapper extends BaseMapper<ActivityFromModel, ActivityToModel, ActivityEntity> {
	mapFrom(param: ActivityFromModel | null) {
		return !param
			? null
			: new ActivityEntity({
				id: param._id.toString(),
				userId: param.userId,
				data: param.data,
				score: param.score,
				createdAt: param.createdAt,
				updatedAt: param.updatedAt,
			})
	}

	mapTo(param: ActivityEntity) {
		return {
			userId: param.userId,
			data: param.data,
		}
	}
}
