import { CustomerFromModel } from '../models/customer'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface CustomerBaseDataSource {
	find: (id: string) => Promise<CustomerFromModel | null>
	get: (query: QueryParams) => Promise<QueryResults<CustomerFromModel>>
	listenToOne: (id: string, listener: Listeners<CustomerFromModel>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<CustomerFromModel>) => Promise<() => void>
}
