import { OrderEntity } from '@modules/marketplace/domain/entities/orders'
import { BaseMapper } from 'equipped'
import { OrderFromModel, OrderToModel } from '../models/orders'

export class OrderMapper extends BaseMapper<OrderFromModel, OrderToModel, OrderEntity> {
	mapFrom(param: OrderFromModel | null) {
		if (!param) return null
		return new OrderEntity({
			id: param._id,
			userId: param.userId,
			email: param.email,
			products: param.products,
			vendorId: param.vendorId,
			cartId: param.cartId,
			location: param.location,
			dropoffNote: param.dropoffNote,
			time: param.time,
			discount: param.discount,
			payment: param.payment,
			price: param.price,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: OrderEntity) {
		return {
			userId: param.userId,
			email: param.email,
			cartId: param.cartId,
			location: param.location,
			dropoffNote: param.dropoffNote,
			time: param.time,
			discount: param.discount,
			payment: param.payment,
		}
	}
}
