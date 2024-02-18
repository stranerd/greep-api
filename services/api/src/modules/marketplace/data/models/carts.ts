import { CartProductItem } from '../../domain/types'

export interface CartFromModel extends CartToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface CartToModel {
	userId: string
	vendorId: string
	active: boolean
	products: CartProductItem[]
}
