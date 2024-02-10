import { BaseMapper } from 'equipped'
import { IProductFromModel, IProductToModel } from '../models/product'
import { ProductEntity } from '@modules/marketplace/domain/entities/productEntities'

export class ProductMapper extends BaseMapper<IProductFromModel, IProductToModel, ProductEntity> {
	mapFrom(param: IProductFromModel | null) {
		return !param
			? null
			: new ProductEntity({
					_id: param._id,
					name: param.name,
					description: param.description,
					images: param.images,
					price: param.price,
					quantity: param.quantity,
					categories: param.categories,
				})
	}

	mapTo(param: ProductEntity) {
		return {
			name: param.name,
			description: param.description,
			images: param.images,
			price: param.price,
			quantity: param.quantity,
			categories: param.categories,
		}
	}
}
