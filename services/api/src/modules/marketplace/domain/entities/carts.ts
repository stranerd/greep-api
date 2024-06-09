import { BaseEntity } from 'equipped'
import { CartProductItem } from '../types'

type CartEntityProps = {
	id: string
	active: boolean
	packs: CartProductItem[][]
	userId: string
	vendorId: string
	createdAt: number
	updatedAt: number
}

export class CartEntity extends BaseEntity<CartEntityProps> {
	constructor(data: CartEntityProps) {
		super(data)
	}
}
