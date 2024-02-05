import { BaseMapper } from 'equipped'
import { ICategoryFromModel, ICategoryToModel } from '../models/categories'
import { CategoryEntity } from '@modules/marketplace/domain/entities/categoryEntities'

export class CategoryMapper extends BaseMapper<ICategoryFromModel, ICategoryToModel, CategoryEntity> {
	mapFrom(param: ICategoryFromModel | null) {
		return !param ? null : new CategoryEntity({
			_id: param._id,
			title: param.title,
		})
	}

	mapTo(param: CategoryEntity) {
		return {
			category: param.category,
		}
	}
}