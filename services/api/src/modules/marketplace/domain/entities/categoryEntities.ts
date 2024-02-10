import { ICategoryFromModel } from '@modules/marketplace/data/models/categories'
import { BaseEntity } from 'equipped'

export class CategoryEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string = 'Pancake Options'
	// public readonly parent: string | null = 'id of Breakfast category'

	constructor(data: ICategoryFromModel) {
		super()
		this.id = data._id
		this.title = data.title
	}
}
