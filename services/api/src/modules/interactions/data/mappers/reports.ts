import { BaseMapper } from 'equipped'
import { ReportEntity } from '../../domain/entities/reports'
import { ReportFromModel, ReportToModel } from '../models/reports'

export class ReportMapper extends BaseMapper<ReportFromModel, ReportToModel, ReportEntity> {
	mapFrom(param: ReportFromModel | null) {
		if (!param) return null
		return new ReportEntity({
			id: param._id.toString(),
			entity: param.entity,
			user: param.user,
			message: param.message,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: ReportEntity) {
		return {
			entity: param.entity,
			user: param.user,
			message: param.message,
		}
	}
}
