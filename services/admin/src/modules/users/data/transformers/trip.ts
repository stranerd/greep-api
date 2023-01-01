import { TripFromModel, TripToModel } from '../models/trip'
import { TripEntity } from '../../domain/entities/trip'

export class TripTransformer {
	fromJSON (model: TripFromModel) {
		const { id, managerId, driverId, status, data, createdAt, updatedAt } = model
		return new TripEntity({
			id, managerId, driverId, status, data, createdAt, updatedAt
		})
	}

	toJSON (entity: TripEntity): TripToModel {
		return {
			driverId: entity.driverId,
			managerId: entity.managerId,
			status: entity.status,
			data: entity.data
		}
	}
}
