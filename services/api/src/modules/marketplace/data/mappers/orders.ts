import { BaseMapper } from 'equipped'
import { OrderEntity } from '../../domain/entities/orders'
import { OrderFromModel, OrderToModel } from '../models/orders'

export class OrderMapper extends BaseMapper<OrderFromModel, OrderToModel, OrderEntity> {
	mapFrom(param: OrderFromModel | null) {
		if (!param) return null
		return new OrderEntity({
			id: param._id,
			userId: param.userId,
			email: param.email,
			driverId: param.driverId,
			status: param.status,
			from: param.from,
			to: param.to,
			dropoffNote: param.dropoffNote,
			time: param.time,
			discount: param.discount,
			payment: param.payment,
			data: param.data,
			fee: param.fee,
			done: param.done,
			promotionIds: param.promotionIds,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: OrderEntity) {
		return {
			userId: param.userId,
			email: param.email,
			from: param.from,
			to: param.to,
			dropoffNote: param.dropoffNote,
			time: param.time,
			discount: param.discount,
			payment: param.payment,
			promotionIds: param.promotionIds,
			data: param.data,
		}
	}
}
