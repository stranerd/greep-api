import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IRequestRepository } from '../../domain/irepositories/requests'
import { RequestStatus } from '../../domain/types'
import { RequestMapper } from '../mappers/requests'
import { RequestToModel } from '../models/requests'
import { Request } from '../mongooseModels/requests'

export class RequestRepository implements IRequestRepository {
	private static instance: RequestRepository
	private mapper: RequestMapper

	private constructor () {
		this.mapper = new RequestMapper()
	}

	static getInstance () {
		if (!RequestRepository.instance) RequestRepository.instance = new RequestRepository()
		return RequestRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Request, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async create (data: RequestToModel) {
		const request = await new Request(data).save()
		return this.mapper.mapFrom(request)!
	}

	async find (id: string) {
		const request = await Request.findById(id)
		return this.mapper.mapFrom(request)
	}

	async accept (id: string, userId: string, value: boolean) {
		const request = await Request.findOneAndUpdate(
			{ _id: id, to: userId, status: RequestStatus.created },
			{ $set: { status: value ? RequestStatus.paid : RequestStatus.rejected } },
			{ new: true })
		return this.mapper.mapFrom(request)
	}

	async acknowledge (id: string, userId: string, value: boolean) {
		const request = await Request.findOneAndUpdate(
			{ _id: id, from: userId, status: RequestStatus.paid },
			{ $set: { status: value ? RequestStatus.acknowledged : RequestStatus.acknowledged } },
			{ new: true })
		return this.mapper.mapFrom(request)
	}
}
