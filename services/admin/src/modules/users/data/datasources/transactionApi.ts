import { TransactionFromModel } from '../models/transaction'
import { TransactionBaseDataSource } from './transactionBase'
import { HttpClient, Listeners, listenOnSocket, QueryParams, QueryResults } from '@modules/core'
import { apiBase } from '@utils/environment'

export class TransactionApiDataSource implements TransactionBaseDataSource {
	private client: HttpClient

	constructor () {
		this.client = new HttpClient(apiBase + '/users/transactions/admin')
	}

	async find (id: string) {
		return await this.client.get<any, TransactionFromModel | null>(`/${id}`, {})
	}

	async get (query: QueryParams) {
		return await this.client.get<QueryParams, QueryResults<TransactionFromModel>>('/', query)
	}

	async listenToOne (id: string, listeners: Listeners<TransactionFromModel>) {
		const listener = listenOnSocket(`users/transactions/${id}`, listeners)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<TransactionFromModel>) {
		const listener = listenOnSocket('users/transactions', listeners)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
