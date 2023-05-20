import { QueryParams, QueryResults } from 'equipped'
import { ActivityToModel } from '../../data/models/activities'
import { ActivityEntity } from '../entities/activities'

export interface IActivityRepository {
	find (id: string): Promise<ActivityEntity | null>

	create (data: ActivityToModel): Promise<ActivityEntity>

	get (query: QueryParams): Promise<QueryResults<ActivityEntity>>
}