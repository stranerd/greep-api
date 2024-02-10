import { MediaOutput } from 'equipped'

export interface IProductFromModel extends IProductToModel {
	_id: string
}

export interface IProductToModel {
	name: string
	price: number
	quantity: number
	description: string
	images: MediaOutput[]
	categories: string[]
}
