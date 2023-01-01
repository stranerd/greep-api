import { CustomerFromModel } from '../models/customer'
import { CustomerBaseDataSource } from './customerBase'
import { HttpClient, Listeners, listenOnSocket, QueryParams, QueryResults } from '@modules/core'
import { apiBase } from '@utils/environment'

export class CustomerApiDataSource implements CustomerBaseDataSource {
	private client: HttpClient

	constructor () {
		this.client = new HttpClient(apiBase + '/users/customers/admin')
	}

	async find (id: string) {
		return await this.client.get<any, CustomerFromModel | null>(`/${id}`, {})
	}

	async get (query: QueryParams) {
		return await this.client.get<QueryParams, QueryResults<CustomerFromModel>>('/', query)
	}

	async listenToOne (id: string, listeners: Listeners<CustomerFromModel>) {
		const listener = listenOnSocket(`users/customers/${id}`, listeners)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<CustomerFromModel>) {
		const listener = listenOnSocket('users/customers', listeners)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
