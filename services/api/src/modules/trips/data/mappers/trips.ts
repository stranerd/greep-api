import { BaseMapper } from 'equipped'
import { TripEntity } from '../../domain/entities/trips'
import { TripFromModel, TripToModel } from '../models/trips'

export class TripMapper extends BaseMapper<TripFromModel, TripToModel, TripEntity> {
	mapFrom(param: TripFromModel | null) {
		return !param ? null : new TripEntity({
			id: param._id.toString(),
			managerId: param.managerId,
			driverId: param.driverId,
			status: param.status,
			data: param.data,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo(param: TripEntity) {
		return {
			managerId: param.managerId,
			driverId: param.driverId,
			status: param.status,
			data: param.data
		}
	}
}