import { BaseUseCase } from '@stranerd/api-commons'
import { IReferralRepository } from '../../i-repositories/referrals'
import { ReferralToModel } from '../../../data/models/referrals'
import { ReferralEntity } from '../../entities/referrals'

export class CreateReferralUseCase implements BaseUseCase<ReferralToModel, ReferralEntity> {
	repository: IReferralRepository

	constructor (repo: IReferralRepository) {
		this.repository = repo
	}

	async execute (input: ReferralToModel) {
		return await this.repository.createReferral(input)
	}
}