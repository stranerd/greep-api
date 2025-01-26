import { TransactionEntity } from '../entities/transactions'
import { TransactionToModel } from '../../data/models/transactions'
import { QueryParams, QueryResults } from 'equipped'

export interface ITransactionRepository {
	find(id: string): Promise<TransactionEntity | null>

	create(data: TransactionToModel): Promise<TransactionEntity>

	get(query: QueryParams): Promise<QueryResults<TransactionEntity>>

	update(data: { id: string; driverId: string; data: Partial<TransactionToModel> }): Promise<TransactionEntity | null>

	delete(data: { id: string; driverId: string }): Promise<boolean>

	updateTripDebt(data: { id: string; driverId: string; amount: number }): Promise<boolean>
}
