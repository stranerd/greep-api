import { QueryParams, QueryResults } from 'equipped'
import { WithdrawalToModel } from '../../data/models/withdrawals'
import { WithdrawalEntity } from '../entities/withdrawals'

export interface IWithdrawalRepository {
	get: (query: QueryParams) => Promise<QueryResults<WithdrawalEntity>>
	find: (id: string) => Promise<WithdrawalEntity | null>
	update: (id: string, data: Partial<WithdrawalToModel>) => Promise<WithdrawalEntity | null>
	generateToken: (id: string, userId: string) => Promise<string>
	complete: (id: string, userId: string, token: string) => Promise<WithdrawalEntity | null>
}
