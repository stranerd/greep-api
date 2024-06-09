import { BaseEntity } from 'equipped'
import { CartProductItem } from '../types'

type CartLinkEntityProps = {
	id: string
	active: boolean
	packs: CartProductItem[][]
	userId: string
	vendorId: string
	createdAt: number
	updatedAt: number
}

export class CartLinkEntity extends BaseEntity<CartLinkEntityProps> {
	constructor(data: CartLinkEntityProps) {
		super(data)
	}
}
