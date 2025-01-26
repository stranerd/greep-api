import { Currencies } from '@modules/payment'
import { EmbeddedUser } from '@modules/users'
import { Ratings } from '@utils/types'
import { MediaOutput } from 'equipped'
import { ProductAddOns, ProductData, ProductMetaType } from '../../domain/types'

export interface ProductFromModel extends ProductToModel {
	_id: string
	meta: ProductMetaType
	ratings: Ratings
	createdAt: number
	updatedAt: number
}

export interface ProductToModel {
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	data: ProductData
	user: EmbeddedUser
	description: string
	banner: MediaOutput
	tagIds: string[]
	addOns: ProductAddOns
	inStock: boolean
}
