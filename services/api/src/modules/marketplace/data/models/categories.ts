export interface CategoryFromModel extends CategoryToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CategoryToModel {
	title: string
}
