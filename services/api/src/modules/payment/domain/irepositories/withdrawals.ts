import { QueryParams, QueryResults } from 'equipped'
import { WithdrawalToModel } from '../../data/models/withdrawals'
import { WithdrawalEntity } from '../entities/withdrawals'

export interface IWithdrawalRepository {
	get: (query: QueryParams) => Promise<QueryResults<WithdrawalEntity>>
	find: (id: string) => Promise<WithdrawalEntity | null>
	update: (id: string, data: Partial<WithdrawalToModel>) => Promise<WithdrawalEntity | null>
}
