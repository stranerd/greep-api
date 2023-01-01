import { TripFromModel } from '../models/trip'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface TripBaseDataSource {
	find: (id: string) => Promise<TripFromModel | null>
	get: (query: QueryParams) => Promise<QueryResults<TripFromModel>>
	listenToOne: (id: string, listener: Listeners<TripFromModel>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<TripFromModel>) => Promise<() => void>
}
