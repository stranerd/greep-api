import { QueryParams, QueryResults } from 'equipped'
import { ProductToModel } from '../../data/models/products'
import { ProductEntity } from '../entities/products'
import { ProductMeta } from '../types'

export interface IProductRepository {
	update(id: string, data: Partial<ProductToModel>, userId: string): Promise<ProductEntity | null>
	delete(id: string, userId: string): Promise<boolean>
	create(data: ProductToModel): Promise<ProductEntity>
	get(query: QueryParams): Promise<QueryResults<ProductEntity>>
	find(id: string): Promise<ProductEntity | null>
	updateUserBio: (user: ProductToModel['user']) => Promise<boolean>
	updateMeta: (ids: string[], property: ProductMeta, value: 1 | -1) => Promise<void>
}
