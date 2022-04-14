import { QueryParams } from '@stranerd/api-commons'
import { IReferralRepository } from '../i-repositories/referrals'
import { ReferralToModel } from '../../data/models/referrals'

export class ReferralsUseCase {
	repository: IReferralRepository

	constructor (repo: IReferralRepository) {
		this.repository = repo
	}

	async createReferral (input: ReferralToModel) {
		return await this.repository.createReferral(input)
	}

	async getReferrals (input: QueryParams) {
		return await this.repository.getReferrals(input)
	}

	async findReferral (input: { userId: string, id: string }) {
		return await this.repository.findReferral(input)
	}
}