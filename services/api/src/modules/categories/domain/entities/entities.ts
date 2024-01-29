import { ICategoryFromModel, ICategoryToModel } from '@modules/categories/data/types'
import { BaseEntity } from 'equipped'

export class CategoryEntity extends BaseEntity {
	public readonly id: string
	public readonly category: string

	constructor (data: ICategoryFromModel) {
		super()
		this.id = data._id
		this.category = data.category
	}
}