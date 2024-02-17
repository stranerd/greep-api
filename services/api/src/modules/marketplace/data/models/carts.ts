export interface CartFromModel extends CartToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CartToModel {
	userId: string
	products: { id: string; quantity: number }[]
}
