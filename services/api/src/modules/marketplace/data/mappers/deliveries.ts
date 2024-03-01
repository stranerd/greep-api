import { BaseMapper } from 'equipped'
import { DeliveryEntity } from '../../domain/entities/deliveries'
import { DeliveryFromModel, DeliveryToModel } from '../models/deliveries'

export class DeliveryMapper extends BaseMapper<DeliveryFromModel, DeliveryToModel, DeliveryEntity> {
	mapFrom(param: DeliveryFromModel | null) {
		return !param
			? null
			: new DeliveryEntity({
					id: param._id.toString(),
					userId: param.userId,
					driverId: param.driverId,
					status: param.status,
					from: param.from,
					to: param.to,
					createdAt: param.createdAt,
					updatedAt: param.updatedAt,
				})
	}

	mapTo(param: DeliveryEntity) {
		return {
			userId: param.userId,
			status: param.status,
			from: param.from,
			to: param.to,
		}
	}
}
