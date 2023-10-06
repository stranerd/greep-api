import { WithdrawalStatus } from '@modules/payment/domain/types'
import { appInstance } from '@utils/environment'
import { NotAuthorizedError, QueryParams, Random } from 'equipped'
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

	async generateToken (id: string, userId: string) {
		const withdrawal = await Withdrawal.findById(id)
		if (!withdrawal || withdrawal.userId !== userId) throw new NotAuthorizedError()
		if (withdrawal.status !== WithdrawalStatus.inProgress) throw new NotAuthorizedError('Withdrawal is not in progress')
		const token = Random.string(12)
		await appInstance.cache.set(`withdrawal-token-${token}`, id, 60 * 3)
		return token
	}

	async complete (id: string, userId: string, token: string) {
		const withdrawal = await Withdrawal.findById(id)
		if (!withdrawal || withdrawal.userId !== userId) throw new NotAuthorizedError()
		if (withdrawal.status !== WithdrawalStatus.inProgress) throw new NotAuthorizedError('Withdrawal is not in progress')
		const cachedId = await appInstance.cache.get(`withdrawal-token-${token}`)
		if (cachedId !== id) throw new NotAuthorizedError('invalid token')
		const completed = await Withdrawal.findByIdAndUpdate(id, { $set: { status: WithdrawalStatus.completed } }, { new: true })
		return this.mapper.mapFrom(completed)
	}
}
