import { QueryParams } from 'equipped'
import { ITransactionRepository } from '../i-repositories/transactions'
import { TransactionToModel } from '../../data/models/transactions'

export class TransactionsUseCase {
	repository: ITransactionRepository

	constructor(repo: ITransactionRepository) {
		this.repository = repo
	}

	async create(input: TransactionToModel) {
		return await this.repository.create(input)
	}

	async update(input: { driverId: string; id: string; data: Partial<TransactionToModel> }) {
		return await this.repository.update(input)
	}

	async delete(input: { driverId: string; id: string }) {
		return await this.repository.delete(input)
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async updateTripDebt(input: { id: string; driverId: string; amount: number }) {
		return await this.repository.updateTripDebt(input)
	}
}
