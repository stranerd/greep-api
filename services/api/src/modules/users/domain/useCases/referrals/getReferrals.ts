import { BaseUseCase, QueryParams, QueryResults } from '@stranerd/api-commons'
import { ReferralEntity } from '../../entities/referrals'
import { IReferralRepository } from '../../i-repositories/referrals'

export class GetReferralsUseCase implements BaseUseCase<QueryParams, QueryResults<ReferralEntity>> {
	repository: IReferralRepository

	constructor (repo: IReferralRepository) {
		this.repository = repo
	}

	async execute (input: QueryParams) {
		return await this.repository.getReferrals(input)
	}
}