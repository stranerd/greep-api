import { IProductFromModel } from '@modules/marketplace/data/models/product'
import { BaseEntity } from 'equipped'

export class ProductEntity extends BaseEntity {
	public readonly id: string
	public readonly name: string
	public readonly price: number
	public readonly images: string[]
	public readonly description: string
	public readonly quantity: number
	public readonly categories: string[]

	constructor(data: IProductFromModel) {
		super()
		this.id = data._id
		this.name = data.name
		this.price = data.price
		this.images = data.images
		this.quantity = data.quantity
		this.description = data.description
		this.categories = data.categories
	}
}
