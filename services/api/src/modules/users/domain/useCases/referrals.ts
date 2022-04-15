import { QueryParams } from '@stranerd/api-commons'
import { IReferralRepository } from '../i-repositories/referrals'
import { ReferralToModel } from '../../data/models/referrals'

export class ReferralsUseCase {
	repository: IReferralRepository

	constructor (repo: IReferralRepository) {
		this.repository = repo
	}

	async create (input: ReferralToModel) {
		return await this.repository.create(input)
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (input: { userId: string, id: string }) {
		return await this.repository.find(input)
	}
}