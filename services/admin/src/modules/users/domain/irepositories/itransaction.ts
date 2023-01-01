import { TransactionEntity } from '../entities/transaction'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ITransactionRepository {
	find: (id: string) => Promise<TransactionEntity | null>,
	get: (query: QueryParams) => Promise<QueryResults<TransactionEntity>>
	listenToOne: (id: string, listener: Listeners<TransactionEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<TransactionEntity>, matches: (entity: TransactionEntity) => boolean) => Promise<() => void>
}
