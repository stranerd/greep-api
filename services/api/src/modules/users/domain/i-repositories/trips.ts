import { TripEntity } from '../entities/trips'
import { TripToModel } from '../../data/models/trips'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface ITripRepository {
	find (id: string): Promise<TripEntity | null>

	create (data: TripToModel): Promise<TripEntity>

	get (query: QueryParams): Promise<QueryResults<TripEntity>>

	update (data: { id: string, driverId: string, data: Partial<TripToModel> }): Promise<TripEntity | null>
}