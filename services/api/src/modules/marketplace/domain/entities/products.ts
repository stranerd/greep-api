import { Currencies } from '@modules/payment'
import { EmbeddedUser, generateDefaultUser } from '@modules/users'
import { BaseEntity, MediaOutput } from 'equipped'

type ProductEntityProps = {
	id: string
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	user: EmbeddedUser
	banner: MediaOutput
	description: string
	tagIds: string[]
	inStock: boolean
	createdAt: number
	updatedAt: number
}

export class ProductEntity extends BaseEntity<ProductEntityProps> {
	constructor(data: ProductEntityProps) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}
