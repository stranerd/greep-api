import { ITripRepository } from '../../domain/i-repositories/trips'
import { TripMapper } from '../mappers/trips'
import { Trip } from '../mongooseModels/trips'
import { mongoose, parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { TripFromModel, TripToModel } from '../models/trips'
import { TripStatus } from '../../domain/types'
import { TransactionToModel } from '../models/transactions'
import { TransactionMapper } from '../mappers/transactions'
import { Transaction } from '@modules/users/data/mongooseModels/transactions'

export class TripRepository implements ITripRepository {
	private static instance: TripRepository
	private mapper = new TripMapper()
	private transactionMapper = new TransactionMapper()

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
		// @ts-ignore
		if (data.data) delete data.data
		const trip = await Trip.findOneAndUpdate(
			{ driverId: data.driverId, status: { $ne: TripStatus.detailed } },
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

	async detail ({ id, driverId, data }: { id: string, driverId: string, data: TransactionToModel }) {
		let res = null as any
		const session = await mongoose.startSession()
		await session.withTransaction(async (session) => {
			const trip = this.mapper.mapFrom(await Trip.findOneAndUpdate({
				_id: id, driverId, status: TripStatus.ended
			}, { $set: { status: TripStatus.detailed } }, { session }))
			if (!trip) return null
			res = await new Transaction(data).save()
			return res
		})
		await session.endSession()
		return this.transactionMapper.mapFrom(res)
	}
}