import { Currencies } from '@modules/payment'
import { generateDefaultUser } from '@modules/users'
import { BaseEntity, MediaOutput } from 'equipped'
import { EmbeddedUser, ProductMetaType } from '../types'

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
	meta: ProductMetaType
	createdAt: number
	updatedAt: number
}

export class ProductEntity extends BaseEntity<ProductEntityProps> {
	constructor(data: ProductEntityProps) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}
}
