import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ITripRepository } from '../../domain/i-repositories/trips'
import { TripStatus } from '../../domain/types'
import { TransactionMapper } from '../mappers/transactions'
import { TripMapper } from '../mappers/trips'
import { TransactionToModel } from '../models/transactions'
import { TripToModel } from '../models/trips'
import { Transaction } from '../mongooseModels/transactions'
import { Trip } from '../mongooseModels/trips'

export class TripRepository implements ITripRepository {
	private static instance: TripRepository
	private mapper = new TripMapper()
	private transactionMapper = new TransactionMapper()

	static getInstance (): TripRepository {
		if (!TripRepository.instance) TripRepository.instance = new TripRepository()
		return TripRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Trip, query)
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
		const ongoingTrip = await Trip.findOne({ customerId: data.customerId, status: { $ne: TripStatus.detailed } })
		if (ongoingTrip) throw new Error('You have an ongoing trip')
		const trip = await new Trip(data).save()
		return this.mapper.mapFrom(trip)!
	}

	async update ({ id, userId, data }: { id: string, userId: string, data: Partial<TripToModel> }) {
		if (data.status && data.data) data[`data.${data.status}`] = data.data[data.status]
		if (data.data) delete data.data
		const trip = await Trip.findOneAndUpdate({ _id: id, $or: [{ driverId: userId }, { customerId: userId }] }, { $set: data }, { new: true })
		return this.mapper.mapFrom(trip)
	}

	async cancel ({ id, customerId }: { id: string, customerId: string }) {
		let res = null as any
		await Trip.collection.conn.transaction(async (session) => {
			const trip = this.mapper.mapFrom(await Trip.findOne({ _id: id, customerId }, {}, { session }))
			if (!trip) return
			if (![TripStatus.created].includes(trip.status)) return
			res = await Trip.findByIdAndUpdate(trip.id, {
				$set: {
					status: TripStatus.cancelled,
					[`data.${TripStatus.cancelled}`]: { timestamp: Date.now() }
				}
			}, { session })
			return res
		})
		return this.mapper.mapFrom(res)
	}

	async detail ({ id, driverId, data }: { id: string, driverId: string, data: TransactionToModel }) {
		let res = null as any
		await Trip.collection.conn.transaction(async (session) => {
			const trip = this.mapper.mapFrom(await Trip.findOneAndUpdate({
				_id: id, driverId, status: TripStatus.ended
			}, { $set: { status: TripStatus.detailed } }, { session }))
			if (!trip) return null
			res = await new Transaction(data).save()
			return res
		})
		return this.transactionMapper.mapFrom(res)
	}

	async accept ({ id, driverId, requested, accepted }: { id: string; driverId: string; requested: boolean; accepted: boolean }) {
		if (!requested && !accepted) return null
		const updates: Record<string, unknown> = {}
		if (accepted) {
			updates.driverId = driverId
			updates[`data.${TripStatus.driverAssigned}`] = { timestamp: Date.now() }
			if (requested) updates[`data.${TripStatus.requestedDriverAccepted}`] = { timestamp: Date.now() }
		} else {
			if (requested) updates[`data.${TripStatus.requestedDriverRejected}`] = { timestamp: Date.now() }
		}
		const trip = await Trip.findOneAndUpdate({
			_id: id, driverId: null, status: TripStatus.created,
			...(requested ? { requestedDriverId: driverId } : {})
		}, { $set: updates }, { new: true })
		return this.mapper.mapFrom(trip)
	}
}