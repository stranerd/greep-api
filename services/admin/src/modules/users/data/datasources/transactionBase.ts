import { TransactionFromModel } from '../models/transaction'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface TransactionBaseDataSource {
	find: (id: string) => Promise<TransactionFromModel | null>
	get: (query: QueryParams) => Promise<QueryResults<TransactionFromModel>>
	listenToOne: (id: string, listener: Listeners<TransactionFromModel>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<TransactionFromModel>) => Promise<() => void>
}
