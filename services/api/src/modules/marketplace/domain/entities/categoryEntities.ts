import { ICategoryFromModel, ICategoryToModel } from '@modules/marketplace/data/models/categories'
import { BaseEntity } from 'equipped'

export class CategoryEntity extends BaseEntity {
	public readonly id: string
	public readonly category: string

	constructor(data: ICategoryFromModel) {
		super()
		this.id = data._id
		this.category = data.title
	}
}
