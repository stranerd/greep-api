import { CustomerFromModel, CustomerToModel } from '../models/customer'
import { CustomerEntity } from '../../domain/entities/customer'

export class CustomerTransformer {
	fromJSON (model: CustomerFromModel) {
		const { id, name, driverId, debt, trips, createdAt, updatedAt } = model
		return new CustomerEntity({
			id, name, driverId, debt, trips, createdAt, updatedAt
		})
	}

	toJSON (_: CustomerEntity): CustomerToModel {
		return {}
	}
}
