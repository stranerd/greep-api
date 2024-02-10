import { IProductToModel } from '@modules/marketplace/data/models/product'

export interface IProductRepository {
	create(product: IProductToModel): Promise<any | null>
	get(): Promise<any[] | null>
}
