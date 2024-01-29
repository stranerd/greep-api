import { QueryParams, QueryResults } from 'equipped'
import { RequestToModel } from '../../data/models/requests'
import { RequestEntity } from '../entities/requests'

export interface IRequestRepository {
	get: (query: QueryParams) => Promise<QueryResults<RequestEntity>>
	find: (id: string) => Promise<RequestEntity | null>
	create: (data: RequestToModel) => Promise<RequestEntity>
	accept: (id: string, userId: string, value: boolean) => Promise<RequestEntity | null>
	acknowledge: (id: string, userId: string, value: boolean) => Promise<RequestEntity | null>
}
