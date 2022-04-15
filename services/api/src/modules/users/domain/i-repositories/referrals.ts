import { ReferralEntity } from '../entities/referrals'
import { ReferralToModel } from '../../data/models/referrals'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface IReferralRepository {
	find (data: { userId: string, id: string }): Promise<ReferralEntity | null>

	create (data: ReferralToModel): Promise<ReferralEntity>

	get (query: QueryParams): Promise<QueryResults<ReferralEntity>>
}