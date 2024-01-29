import { ICartFromModel } from '@modules/cart/data/types'
import { BaseEntity } from 'equipped'

export class CartEntity extends BaseEntity {
	public readonly id: string
	public readonly productId: string
	public readonly quantity: number
	public readonly userId: string

	constructor (data: ICartFromModel) {
		super()
		this.id = data._id
		this.productId = data.productId
		this.quantity = data.quantity
		this.userId = data.userId
	}
}