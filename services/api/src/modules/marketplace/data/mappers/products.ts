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
			banner: param.banner,
			price: param.price,
			tagIds: param.tagIds,
			inStock: param.inStock,
			user: param.user,
			meta: param.meta,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: ProductEntity) {
		return {
			title: param.title,
			description: param.description,
			banner: param.banner,
			price: param.price,
			tagIds: param.tagIds,
			inStock: param.inStock,
			user: param.user,
		}
	}
}
