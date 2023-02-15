import { BaseMapper } from 'equipped'
import { CustomerEntity } from '../../domain/entities/customers'
import { CustomerFromModel, CustomerToModel } from '../models/customers'

export class CustomerMapper extends BaseMapper<CustomerFromModel, CustomerToModel, CustomerEntity> {
	mapFrom(param: CustomerFromModel | null) {
		return !param ? null : new CustomerEntity({
			id: param._id.toString(),
			name: param.name,
			driverId: param.driverId,
			debt: param.debt,
			trips: param.trips,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo(param: CustomerEntity) {
		return {
			name: param.name,
			driverId: param.driverId
		}
	}
}