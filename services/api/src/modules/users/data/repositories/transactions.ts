import { ITransactionRepository } from '../../domain/i-repositories/transactions'
import { TransactionMapper } from '../mappers/transactions'
import { Transaction } from '../mongooseModels/transactions'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { TransactionFromModel, TransactionToModel } from '../models/transactions'
import { TransactionType } from '../../domain/types'

export class TransactionRepository implements ITransactionRepository {
	private static instance: TransactionRepository
	private mapper = new TransactionMapper()

	static getInstance (): TransactionRepository {
		if (!TransactionRepository.instance) TransactionRepository.instance = new TransactionRepository()
		return TransactionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<TransactionFromModel>(Transaction, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!)
		}
	}

	async find ({ userId, id }: { userId: string, id: string }) {
		const transaction = await Transaction.findOne({ _id: id, $or: [{ driverId: userId }, { managerId: userId }] })
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