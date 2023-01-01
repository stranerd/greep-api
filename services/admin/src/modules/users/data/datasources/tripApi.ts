import { TripFromModel } from '../models/trip'
import { TripBaseDataSource } from './tripBase'
import { HttpClient, Listeners, listenOnSocket, QueryParams, QueryResults } from '@modules/core'
import { apiBase } from '@utils/environment'

export class TripApiDataSource implements TripBaseDataSource {
	private client: HttpClient

	constructor () {
		this.client = new HttpClient(apiBase + '/users/trips/admin')
	}

	async find (id: string) {
		return await this.client.get<any, TripFromModel | null>(`/${id}`, {})
	}

	async get (query: QueryParams) {
		return await this.client.get<QueryParams, QueryResults<TripFromModel>>('/', query)
	}

	async listenToOne (id: string, listeners: Listeners<TripFromModel>) {
		const listener = listenOnSocket(`users/trips/${id}`, listeners)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<TripFromModel>) {
		const listener = listenOnSocket('users/trips', listeners)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
