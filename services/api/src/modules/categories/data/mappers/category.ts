import { BaseMapper } from 'equipped'
import { ICategoryFromModel, ICategoryToModel } from '../types'
import { CategoryEntity } from '@modules/categories/domain/entities/entities'

export class CategoryMapper extends BaseMapper<ICategoryFromModel, ICategoryToModel, CategoryEntity> {
	mapFrom(param: ICategoryFromModel | null) {
		return !param ? null : new CategoryEntity({
			_id: param._id,
			category: param.category,
		})
	}

	mapTo(param: CategoryEntity) {
		return {
			category: param.category,
		}
	}
}