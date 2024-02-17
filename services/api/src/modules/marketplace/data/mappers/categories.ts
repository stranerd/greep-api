import { CategoryEntity } from '@modules/marketplace/domain/entities/categories'
import { BaseMapper } from 'equipped'
import { CategoryFromModel, CategoryToModel } from '../models/categories'

export class CategoryMapper extends BaseMapper<CategoryFromModel, CategoryToModel, CategoryEntity> {
	mapFrom(param: CategoryFromModel | null) {
		if (!param) return null
		return new CategoryEntity({ id: param._id, title: param.title, createdAt: param.createdAt, updatedAt: param.updatedAt })
	}

	mapTo(param: CategoryEntity) {
		return {
			title: param.title,
		}
	}
}
