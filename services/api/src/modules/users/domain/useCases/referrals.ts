import { QueryParams } from 'equipped'
import { ReferralToModel } from '../../data/models/referrals'
import { IReferralRepository } from '../i-repositories/referrals'

export class ReferralsUseCase {
	repository: IReferralRepository

	constructor (repo: IReferralRepository) {
		this.repository = repo
	}

	async create (input: ReferralToModel) {
		return await this.repository.create(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (input: QueryParams) {
		return await this.repository.getReferrals(input)
	}
}