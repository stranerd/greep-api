import { BaseMapper } from 'equipped'
import { ViewEntity } from '../../domain/entities/views'
import { ViewFromModel, ViewToModel } from '../models/views'

export class ViewMapper extends BaseMapper<ViewFromModel, ViewToModel, ViewEntity> {
	mapFrom(param: ViewFromModel | null) {
		if (!param) return null
		return new ViewEntity({
			id: param._id.toString(),
			entity: param.entity,
			user: param.user,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: ViewEntity) {
		return {
			entity: param.entity,
			user: param.user,
		}
	}
}
