import { BaseMapper } from 'equipped'
import { CartLinkEntity } from '../../domain/entities/cartLinks'
import { CartLinkFromModel, CartLinkToModel } from '../models/cartLinks'

export class CartLinkMapper extends BaseMapper<CartLinkFromModel, CartLinkToModel, CartLinkEntity> {
	mapFrom(param: CartLinkFromModel | null) {
		if (!param) return null
		return new CartLinkEntity({
			id: param._id,
			products: param.products,
			userId: param.userId,
			vendorId: param.vendorId,
			active: param.active,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: CartLinkEntity) {
		return {
			userId: param.userId,
			vendorId: param.vendorId,
			products: param.products,
		}
	}
}
