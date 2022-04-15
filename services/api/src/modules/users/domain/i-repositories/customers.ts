import { CustomerEntity } from '../entities/customers'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface ICustomerRepository {
	get (query: QueryParams): Promise<QueryResults<CustomerEntity>>

	updateTrip (data: { driverId: string, name: string, count: number }): Promise<boolean>

	updateDebt (data: { driverId: string, name: string, count: number }): Promise<boolean>

	find (data: { id: string, userId: string }): Promise<CustomerEntity | null>
}