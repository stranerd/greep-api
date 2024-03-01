import { QueryParams, QueryResults } from 'equipped'
import { DeliveryToModel } from '../../data/models/deliveries'
import { DeliveryEntity } from '../entities/deliveries'

export interface IDeliveryRepository {
	get: (query: QueryParams) => Promise<QueryResults<DeliveryEntity>>
	find: (id: string) => Promise<DeliveryEntity | null>
	create: (data: DeliveryToModel) => Promise<DeliveryEntity>
	update: (id: string, data: Partial<DeliveryToModel>) => Promise<DeliveryEntity | null>
	assignDriver: (id: string, driverId: string) => Promise<DeliveryEntity | null>
	generateToken: (id: string, userId: string) => Promise<string>
	complete: (id: string, userId: string, token: string) => Promise<DeliveryEntity | null>
}
