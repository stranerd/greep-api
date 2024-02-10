import { IProductToModel } from '@modules/marketplace/data/models/product'
import { ProductEntity } from '../entities/productEntities'

export interface IProductRepository {
	update(id: string, update: Partial<IProductToModel>): Promise<ProductEntity | null>
	delete(id: string): Promise<any | null>
	create(product: IProductToModel): Promise<ProductEntity | null>
	get(): Promise<any[] | null>
}
