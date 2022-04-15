import { CustomerEntity } from '../entities/customers'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface ICustomerRepository {
	getCustomers (query: QueryParams): Promise<QueryResults<CustomerEntity>>

	updateTrip (data: { driverId: string, name: string, count: number }): Promise<boolean>

	updateDebt (data: { driverId: string, name: string, count: number }): Promise<boolean>

	findCustomer (customerId: string): Promise<CustomerEntity | null>
}