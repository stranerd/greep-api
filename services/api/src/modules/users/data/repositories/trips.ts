import { ITripRepository } from '../../domain/i-repositories/trips'
import { TripMapper } from '../mappers/trips'
import { Trip } from '../mongooseModels/trips'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { TripFromModel, TripToModel } from '../models/trips'
import { TripStatus } from '../../domain/types'

export class TripRepository implements ITripRepository {
	private static instance: TripRepository
	private mapper = new TripMapper()

	static getInstance (): TripRepository {
		if (!TripRepository.instance) TripRepository.instance = new TripRepository()
		return TripRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<TripFromModel>(Trip, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!)
		}
	}

	async find (id: string) {
		const trip = await Trip.findById(id)
		return this.mapper.mapFrom(trip)
	}

	async create (data: TripToModel) {
		data[`data.${data.status}`] = data.data[data.status]
		if (data.data) { // @ts-ignore
			delete data.data
		}
		const trip = await Trip.findOneAndUpdate(
			{ driverId: data.driverId, status: { $ne: TripStatus.endedTrip } },
			{ $setOnInsert: data },
			{ new: true, upsert: true }
		)
		return this.mapper.mapFrom(trip)!
	}

	async update ({ id, driverId, data }: { id: string, driverId: string, data: Partial<TripToModel> }) {
		if (data.status && data.data) data[`data.${data.status}`] = data.data[data.status]
		if (data.data) delete data.data
		const trip = await Trip.findOneAndUpdate({ _id: id, driverId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(trip)
	}
}