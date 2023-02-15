import { CustomerEntity } from '../entities/customers'
import { QueryParams, QueryResults } from 'equipped'

export interface ICustomerRepository {
	get(query: QueryParams): Promise<QueryResults<CustomerEntity>>

	updateTrip(data: { driverId: string, name: string, count: number }): Promise<boolean>

	updateDebt(data: { driverId: string, name: string, count: number }): Promise<boolean>

	find(id: string): Promise<CustomerEntity | null>
}