import { ProductEntity } from '@modules/marketplace/domain/entities/products'
import { BaseMapper } from 'equipped'
import { ProductFromModel, ProductToModel } from '../models/products'

export class ProductMapper extends BaseMapper<ProductFromModel, ProductToModel, ProductEntity> {
	mapFrom(param: ProductFromModel | null) {
		if (!param) return null
		return new ProductEntity({
			id: param._id,
			title: param.title,
			description: param.description,
			images: param.images,
			price: param.price,
			categoryIds: param.categoryIds,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: ProductEntity) {
		return {
			title: param.title,
			description: param.description,
			images: param.images,
			price: param.price,
			categoryIds: param.categoryIds,
		}
	}
}
