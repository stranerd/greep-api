import { IProductToModel } from '@modules/marketplace/data/models'

export interface IProductRepository {
	create(product: IProductToModel): Promise<any | null>
	get(): Promise<any[] | null>
}
