import { BaseEntity } from 'equipped'

type CartEntityProps = {
	id: string
	products: { id: string; quantity: number }[]
	userId: string
	createdAt: number
	updatedAt: number
}

export class CartEntity extends BaseEntity<CartEntityProps> {
	constructor(data: CartEntityProps) {
		super(data)
	}
}
