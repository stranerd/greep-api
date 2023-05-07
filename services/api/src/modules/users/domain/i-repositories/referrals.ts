import { QueryParams, QueryResults } from 'equipped'
import { ReferralToModel } from '../../data/models/referrals'
import { ReferralEntity } from '../entities/referrals'

export interface IReferralRepository {
	find (id: string): Promise<ReferralEntity | null>

	create (data: ReferralToModel): Promise<ReferralEntity>

	getReferrals (query: QueryParams): Promise<QueryResults<ReferralEntity>>
}