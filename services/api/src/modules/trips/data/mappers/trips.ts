import { BaseMapper } from 'equipped'
import { TripEntity } from '../../domain/entities/trips'
import { TripFromModel, TripToModel } from '../models/trips'

export class TripMapper extends BaseMapper<TripFromModel, TripToModel, TripEntity> {
	mapFrom(param: TripFromModel | null) {
		return !param
			? null
			: new TripEntity({
					id: param._id.toString(),
					customerId: param.customerId,
					driverId: param.driverId,
					requestedDriverId: param.requestedDriverId,
					status: param.status,
					from: param.from,
					to: param.to,
					discount: param.discount,
					data: param.data,
					createdAt: param.createdAt,
					updatedAt: param.updatedAt,
				})
	}

	mapTo(param: TripEntity) {
		return {
			customerId: param.customerId,
			driverId: param.driverId,
			requestedDriverId: param.driverId,
			status: param.status,
			from: param.from,
			to: param.to,
			discount: param.discount,
			data: param.data,
		}
	}
}
