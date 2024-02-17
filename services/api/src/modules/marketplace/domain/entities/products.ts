import { Currencies } from '@modules/payment'
import { BaseEntity, MediaOutput } from 'equipped'

type ProductEntityProps = {
	id: string
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	banner: MediaOutput
	description: string
	categoryIds: string[]
	inStock: boolean
	createdAt: number
	updatedAt: number
}

export class ProductEntity extends BaseEntity<ProductEntityProps> {
	constructor(data: ProductEntityProps) {
		super(data)
	}
}
