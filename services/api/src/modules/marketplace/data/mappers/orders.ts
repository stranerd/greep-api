import { OrderEntity } from '@modules/marketplace/domain/entities/orders'
import { BaseMapper } from 'equipped'
import { OrderFromModel, OrderToModel } from '../models/orders'

export class OrderMapper extends BaseMapper<OrderFromModel, OrderToModel, OrderEntity> {
	mapFrom(param: OrderFromModel | null) {
		if (!param) return null
		return new OrderEntity({
			id: param._id,
			userId: param.userId,
			products: param.products,
			cartId: param.cartId,
			location: param.location,
			dropoffNote: param.dropoffNote,
			time: param.time,
			discount: param.discount,
			payment: param.payment,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: OrderEntity) {
		return {
			userId: param.userId,
			cartId: param.cartId,
			location: param.location,
			dropoffNote: param.dropoffNote,
			time: param.time,
			discount: param.discount,
			payment: param.payment,
		}
	}
}
