import { ReferralEntity } from '../entities/referrals'
import { ReferralToModel } from '../../data/models/referrals'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface IReferralRepository {
	findReferral (data: { userId: string, id: string }): Promise<ReferralEntity | null>

	createReferral (data: ReferralToModel): Promise<ReferralEntity>

	getReferrals (query: QueryParams): Promise<QueryResults<ReferralEntity>>
}