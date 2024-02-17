import { QueryParams, QueryResults } from 'equipped'
import { CategoryToModel } from '../../data/models/categories'
import { CategoryEntity } from '../entities/categories'

export interface ICategoryRepository {
	create(data: CategoryToModel): Promise<CategoryEntity>
	update(id: string, data: Partial<CategoryToModel>): Promise<CategoryEntity | null>
	delete(id: string): Promise<boolean>
	get(query: QueryParams): Promise<QueryResults<CategoryEntity>>
	find(id: string): Promise<CategoryEntity | null>
}
