import { TagMeta } from '@modules/interactions'
import { Currencies } from '@modules/payment'
import { UserVendorType, generateDefaultUser } from '@modules/users'
import { Ratings } from '@utils/types'
import { BaseEntity, MediaOutput } from 'equipped'
import { EmbeddedUser, ProductAddOn, ProductData, ProductMetaType } from '../types'

type ProductEntityProps = {
	id: string
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	data: ProductData
	user: EmbeddedUser
	banner: MediaOutput
	description: string
	tagIds: string[]
	inStock: boolean
	addOn: ProductAddOn | null
	meta: ProductMetaType
	ratings: Ratings
	createdAt: number
	updatedAt: number
}

export class ProductEntity extends BaseEntity<ProductEntityProps> {
	constructor(data: ProductEntityProps) {
		data.user = generateDefaultUser(data.user)
		super(data)
	}

	getTagMetaType() {
		return this.data.type === UserVendorType.foods ? TagMeta.productsFoods : TagMeta.productsItems
	}
}
