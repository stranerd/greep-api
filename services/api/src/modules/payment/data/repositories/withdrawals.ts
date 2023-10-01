import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IWithdrawalRepository } from '../../domain/irepositories/withdrawals'
import { WithdrawalMapper } from '../mappers/withdrawals'
import { WithdrawalToModel } from '../models/withdrawals'
import { Withdrawal } from '../mongooseModels/withdrawals'

export class WithdrawalRepository implements IWithdrawalRepository {
	private static instance: WithdrawalRepository
	private mapper: WithdrawalMapper

	private constructor () {
		this.mapper = new WithdrawalMapper()
	}

	static getInstance () {
		if (!WithdrawalRepository.instance) WithdrawalRepository.instance = new WithdrawalRepository()
		return WithdrawalRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Withdrawal, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (id: string) {
		const withdrawal = await Withdrawal.findById(id)
		return this.mapper.mapFrom(withdrawal)
	}

	async update (id: string, data: Partial<WithdrawalToModel>) {
		const withdrawal = await Withdrawal.findByIdAndUpdate(id, { $set: data }, { new: true })
		return this.mapper.mapFrom(withdrawal)
	}
}
