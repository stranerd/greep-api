import { BaseMapper } from 'equipped'
import { IProductFromModel, IProductToModel } from '../types'
import { ProductEntity } from '@modules/products/domain/entities/entities'

export class ProductMapper extends BaseMapper<IProductFromModel, IProductToModel, ProductEntity> {
	mapFrom(param: IProductFromModel | null) {
		return !param ? null : new ProductEntity({
			_id: param._id,
			name: param.name,
			description: param.description,
			images: param.images,
			price: param.price,
			quantity: param.quantity,
			categories: param.categories
		})
	}

	mapTo(param: ProductEntity) {
		return {
			name: param.name,
			description: param.description,
			images: param.images,
			price: param.price,
			quantity: param.quantity,
			categories: param.categories
		}
	}
}