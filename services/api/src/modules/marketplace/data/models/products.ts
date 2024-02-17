import { Currencies } from '@modules/payment'
import { MediaOutput } from 'equipped'

export interface ProductFromModel extends ProductToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface ProductToModel {
	title: string
	price: {
		amount: number
		currency: Currencies
	}
	description: string
	banner: MediaOutput
	categoryIds: string[]
	inStock: boolean
}
