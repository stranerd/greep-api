import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ITransactionRepository } from '../../domain/i-repositories/transactions'
import { TransactionType } from '../../domain/types'
import { TransactionMapper } from '../mappers/transactions'
import { TransactionToModel } from '../models/transactions'
import { Transaction } from '../mongooseModels/transactions'

export class TransactionRepository implements ITransactionRepository {
	private static instance: TransactionRepository
	private mapper = new TransactionMapper()

	static getInstance (): TransactionRepository {
		if (!TransactionRepository.instance) TransactionRepository.instance = new TransactionRepository()
		return TransactionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Transaction, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!)
		}
	}

	async find (id: string) {
		const transaction = await Transaction.findById(id)
		return this.mapper.mapFrom(transaction)
	}

	async create (data: TransactionToModel) {
		const transaction = await new Transaction(data).save()
		return this.mapper.mapFrom(transaction)!
	}

	async update ({ id, managerId, data }: { id: string, managerId: string, data: Partial<TransactionToModel> }) {
		const transaction = await Transaction.findOneAndUpdate({ _id: id, managerId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(transaction)
	}

	async delete ({ id, managerId }: { id: string, managerId: string }) {
		const transaction = await Transaction.findOneAndDelete({ _id: id, managerId })
		return !!transaction
	}

	async updateTripDebt ({ id, driverId, amount }: { id: string, driverId: string, amount: number }) {
		const transaction = await Transaction.findOneAndUpdate(
			{ _id: id, driverId, 'data.type': TransactionType.trip },
			{ $inc: { 'data.debt': -amount } },
			{ new: true })
		return !!transaction
	}
}