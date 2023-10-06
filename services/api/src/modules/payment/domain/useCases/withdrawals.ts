import { QueryParams } from 'equipped'
import { WithdrawalToModel } from '../../data/models/withdrawals'
import { IWithdrawalRepository } from '../irepositories/withdrawals'

export class WithdrawalsUseCase {
	repository: IWithdrawalRepository

	constructor (repo: IWithdrawalRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async update (data: { id: string, data: Partial<WithdrawalToModel> }) {
		return await this.repository.update(data.id, data.data)
	}

	async generateToken (data: { id: string, userId: string }) {
		return await this.repository.generateToken(data.id, data.userId)
	}

	async complete (data: { id: string, userId: string, token: string }) {
		return await this.repository.complete(data.id, data.userId, data.token)
	}
}