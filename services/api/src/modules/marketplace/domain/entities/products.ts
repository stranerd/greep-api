import { Currencies } from '@modules/payment'
import { BaseEntity, MediaOutput } from 'equipped'

type ProductEntityProps = {
	id: string
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	images: MediaOutput[]
	description: string
	categoryIds: string[]
	createdAt: number
	updatedAt: number
}

export class ProductEntity extends BaseEntity<ProductEntityProps> {
	constructor(data: ProductEntityProps) {
		super(data)
	}
}
