import { CustomerEntity } from '../entities/customer'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ICustomerRepository {
	find: (id: string) => Promise<CustomerEntity | null>,
	get: (query: QueryParams) => Promise<QueryResults<CustomerEntity>>
	listenToOne: (id: string, listener: Listeners<CustomerEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<CustomerEntity>, matches: (entity: CustomerEntity) => boolean) => Promise<() => void>
}
