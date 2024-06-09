import { BaseMapper } from 'equipped'
import { CartEntity } from '../../domain/entities/carts'
import { CartFromModel, CartToModel } from '../models/carts'

export class CartMapper extends BaseMapper<CartFromModel, CartToModel, CartEntity> {
	mapFrom(param: CartFromModel | null) {
		if (!param) return null
		return new CartEntity({
			id: param._id,
			packs: param.packs,
			userId: param.userId,
			vendorId: param.vendorId,
			active: param.active,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: CartEntity) {
		return {
			userId: param.userId,
			vendorId: param.vendorId,
			packs: param.packs,
			active: param.active,
		}
	}
}
