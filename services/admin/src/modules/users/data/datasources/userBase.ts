import { UserFromModel } from '../models/user'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface UserBaseDataSource {
	find: (id: string) => Promise<UserFromModel | null>
	get: (query: QueryParams) => Promise<QueryResults<UserFromModel>>
	listenToOne: (id: string, listener: Listeners<UserFromModel>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<UserFromModel>) => Promise<() => void>
}
