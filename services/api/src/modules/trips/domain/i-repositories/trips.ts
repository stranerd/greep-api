import { QueryParams, QueryResults } from 'equipped'
import { TransactionToModel } from '../../data/models/transactions'
import { TripToModel } from '../../data/models/trips'
import { TransactionEntity } from '../entities/transactions'
import { TripEntity } from '../entities/trips'

export interface ITripRepository {
	find(id: string): Promise<TripEntity | null>

	create(data: TripToModel): Promise<TripEntity>

	get(query: QueryParams): Promise<QueryResults<TripEntity>>

	update(data: { id: string; userId: string; data: Partial<TripToModel> }): Promise<TripEntity | null>

	cancel(data: { id: string; customerId: string }): Promise<TripEntity | null>

	detail(data: { id: string; driverId: string; data: TransactionToModel }): Promise<TransactionEntity | null>

	accept(data: { id: string; driverId: string; requested: boolean; accepted: boolean }): Promise<TripEntity | null>
}
