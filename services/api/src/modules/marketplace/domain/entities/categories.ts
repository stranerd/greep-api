import { BaseEntity } from 'equipped'

type CategoryEntityProps = {
	id: string
	title: string
	createdAt: number
	updatedAt: number
}

export class CategoryEntity extends BaseEntity<CategoryEntityProps> {
	constructor(data: CategoryEntityProps) {
		super(data)
	}
}
