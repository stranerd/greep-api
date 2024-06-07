import { CartProductItem, OrderToModelBase } from '../../domain/types'

export interface CartLinkFromModel extends CartLinkToModel {
	_id: string
	active: boolean
	createdAt: number
	updatedAt: number
}

export interface CartLinkToModel extends Pick<OrderToModelBase, 'to' | 'time' | 'payment'> {
	userId: string
	vendorId: string
	products: CartProductItem[]
}
