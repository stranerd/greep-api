import { CartEntity } from '@modules/cart/domain/entities/entities'
import { BaseMapper } from 'equipped'
import { ICartFromModel, ICartToModel } from '../types'

export class CartMapper extends BaseMapper<ICartFromModel, ICartToModel, CartEntity> {
	mapFrom(param: ICartFromModel | null) {
		return !param ? null : new CartEntity({
			_id: param._id,
			productId: param.productId,
			quantity: param.quantity,
			userId: param.userId,
		})
	}

	mapTo(param: CartEntity) {
		return {
			productId: param.productId,
			quantity: param.quantity,
			userId: param.userId,
		}
	}
}