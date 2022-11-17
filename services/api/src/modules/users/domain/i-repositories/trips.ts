import { TripEntity } from '../entities/trips'
import { TripToModel } from '../../data/models/trips'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { TransactionToModel } from '../../data/models/transactions'
import { TransactionEntity } from '../entities/transactions'

export interface ITripRepository {
	find (id: string): Promise<TripEntity | null>

	create (data: TripToModel): Promise<TripEntity>

	get (query: QueryParams): Promise<QueryResults<TripEntity>>

	update (data: { id: string, driverId: string, data: Partial<TripToModel> }): Promise<TripEntity | null>

	detail (data: { id: string, driverId: string, data: TransactionToModel }): Promise<TransactionEntity | null>
}