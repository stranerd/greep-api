import { BaseUseCase } from '@stranerd/api-commons'
import { ReferralEntity } from '../../entities/referrals'
import { IReferralRepository } from '../../i-repositories/referrals'

type Input = { userId: string, id: string }

export class FindReferralUseCase implements BaseUseCase<Input, ReferralEntity | null> {
	repository: IReferralRepository

	constructor (repo: IReferralRepository) {
		this.repository = repo
	}

	async execute (input: Input) {
		return await this.repository.findReferral(input)
	}
}