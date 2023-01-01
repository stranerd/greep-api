import { TripEntity } from '../entities/trip'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ITripRepository {
	find: (id: string) => Promise<TripEntity | null>,
	get: (query: QueryParams) => Promise<QueryResults<TripEntity>>
	listenToOne: (id: string, listener: Listeners<TripEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<TripEntity>, matches: (entity: TripEntity) => boolean) => Promise<() => void>
}
