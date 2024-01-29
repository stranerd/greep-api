import { BaseMapper } from 'equipped'
import { RequestEntity } from '../../domain/entities/requests'
import { RequestFromModel, RequestToModel } from '../models/requests'

export class RequestMapper extends BaseMapper<RequestFromModel, RequestToModel, RequestEntity> {
	mapFrom(param: RequestFromModel | null) {
		return !param
			? null
			: new RequestEntity({
				id: param._id.toString(),
				description: param.description,
				from: param.from,
				to: param.to,
				status: param.status,
				amount: param.amount,
				currency: param.currency,
				createdAt: param.createdAt,
				updatedAt: param.updatedAt,
			})
	}

	mapTo(param: RequestEntity) {
		return {
			description: param.description,
			from: param.from,
			to: param.to,
			amount: param.amount,
			currency: param.currency,
		}
	}
}
