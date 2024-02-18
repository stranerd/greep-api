import { CartEntity } from '@modules/marketplace/domain/entities/carts'
import { BaseMapper } from 'equipped'
import { CartFromModel, CartToModel } from '../models/carts'

export class CartMapper extends BaseMapper<CartFromModel, CartToModel, CartEntity> {
	mapFrom(param: CartFromModel | null) {
		if (!param) return null
		return new CartEntity({
			id: param._id,
			products: param.products,
			userId: param.userId,
			active: param.active,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: CartEntity) {
		return {
			userId: param.userId,
			products: param.products,
			active: param.active,
		}
	}
}
