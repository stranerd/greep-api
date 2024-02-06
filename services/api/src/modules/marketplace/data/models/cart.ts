export interface ICartFromModel extends ICartToModel {
	_id: string
}

export interface ICartToModel {
	productId: string
	userId: string
	quantity: number
}
