import { ITransactionRepository } from '../irepositories/itransaction'
import { TransactionEntity } from '../entities/transaction'
import { Conditions, Listeners, QueryKeys, QueryParams } from '@modules/core'
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

	async get (userId: string, date?: number) {
		const condition: QueryParams = {
			where: [
				{
					condition: QueryKeys.or,
					value: [{ field: 'driverId', value: userId }, { field: 'managerId', value: userId }]
				}
			],
			sort: [{ field: 'createdAt', desc: true }],
			limit: PAGINATION_LIMIT
		}
		if (date) condition.where!.push({ field: 'createdAt', value: date, condition: Conditions.lt })
		return await this.repository.get(condition)
	}

	async listenToOne (id: string, listeners: Listeners<TransactionEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async listen (userId: string, listener: Listeners<TransactionEntity>, date?: number) {
		const conditions: QueryParams = {
			where: [
				{
					condition: QueryKeys.or,
					value: [{ field: 'driverId', value: userId }, { field: 'managerId', value: userId }]
				}
			],
			sort: [{ field: 'createdAt', desc: true }],
			all: true
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.gt, value: date })

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			if (date) return entity.createdAt >= date
			return true
		})
	}

	async search (userId: string, detail: string) {
		const query: QueryParams = {
			where: [
				{
					condition: QueryKeys.or,
					value: [{ field: 'driverId', value: userId }, { field: 'managerId', value: userId }]
				}
			],
			all: true, search: { value: detail, fields: searchFields }
		}
		return (await this.repository.get(query)).results
	}
}
