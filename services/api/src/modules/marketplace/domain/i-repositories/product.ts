import { IProductToModel } from '@modules/marketplace/data/models/product'
import { ProductEntity } from '../entities/productEntities'

export interface IProductRepository {
	update(id: string, update: Partial<IProductToModel>): Promise<ProductEntity | null>
	create(product: IProductToModel): Promise<any | null>
	get(): Promise<any[] | null>
}
