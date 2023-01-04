import { ITransactionRepository } from '../irepositories/itransaction'
import { TransactionEntity } from '../entities/transaction'
import { Conditions, Listeners, QueryParams } from '@modules/core'
import { PAGINATION_LIMIT } from '@utils/constants'

const searchFields = ['description', 'data.name', 'data.customerName']

export class TransactionsUseCase {
	private repository: ITransactionRepository

	constructor (repository: ITransactionRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (date?: number) {
		const condition: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			limit: PAGINATION_LIMIT
		}
		if (date) condition.where = [{ field: 'createdAt', value: date, condition: Conditions.lt }]
		return await this.repository.get(condition)
	}

	async listenToOne (id: string, listeners: Listeners<TransactionEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async listen (listener: Listeners<TransactionEntity>, date?: number) {
		const conditions: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			all: true
		}
		if (date) conditions.where = [{ field: 'createdAt', condition: Conditions.gt, value: date }]

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			if (date) return entity.createdAt >= date
			return true
		})
	}

	async search (detail: string) {
		const query: QueryParams = {
			all: true, search: { value: detail, fields: searchFields }
		}
		return (await this.repository.get(query)).results
	}
}
