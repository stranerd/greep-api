import { PaymentType, TransactionType, TripStatus, TripsUseCases, UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	Request,
	Schema, validateReq, ValidationError
} from 'equipped'

export class TripsController {
	static async getTrips(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }, { field: 'managerId', value: req.authUser!.id }]
		query.authType = QueryKeys.or
		return await TripsUseCases.get(query)
	}

	static async getTripsAdmin(req: Request) {
		const query = req.query as QueryParams
		return await TripsUseCases.get(query)
	}

	static async findTrip(req: Request) {
		const trip = await TripsUseCases.find(req.params.id)
		if (!trip || ![trip.managerId, trip.driverId].includes(req.authUser!.id)) throw new NotFoundError()
		return trip
	}

	static async findTripAdmin(req: Request) {
		const trip = await TripsUseCases.find(req.params.id)
		if (!trip) throw new NotFoundError()
		return trip
	}

	static async createTrip(req: Request) {
		const data = validateReq({
			coords: Schema.tuple([Schema.number(), Schema.number()]),
			location: Schema.string().min(1)
		}, req.body)

		const driverId = req.authUser!.id
		const driver = await UsersUseCases.find(driverId)
		if (!driver) throw new BadRequestError('profile not found')

		return await TripsUseCases.create({
			driverId, managerId: driver.manager?.managerId ?? driverId,
			status: TripStatus.gotten,
			data: {
				[TripStatus.gotten]: { ...data, timestamp: Date.now() }
			}
		})
	}

	static async updateTrip(req: Request, status: TripStatus) {
		const data = validateReq({
			coords: Schema.tuple([Schema.number(), Schema.number()]),
			location: Schema.string().min(1)
		}, req.body)

		const trip = await TripsUseCases.find(req.params.id)
		if (!trip) throw new BadRequestError('trip not found')
		const supportedStatus = {
			[TripStatus.started]: TripStatus.gotten,
			[TripStatus.ended]: TripStatus.started
		}
		if (supportedStatus[status] !== trip.status) throw new ValidationError([{
			field: 'status',
			messages: ['can\'t update this trip with: ' + status]
		}])

		const updated = await TripsUseCases.update({
			id: trip.id, driverId: req.authUser!.id,
			data: {
				status,
				data: {
					[status]: { ...data, timestamp: Date.now() }
				}
			}
		})

		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async detailTrip(req: Request) {
		const data = validateReq({
			amount: Schema.number().gt(0),
			description: Schema.string(),
			recordedAt: Schema.time().asStamp(),
			data: Schema.object({
				customerName: Schema.string().min(1),
				paidAmount: Schema.number(),
				paymentType: Schema.any<PaymentType>().in(Object.values(PaymentType), (cur, val) => cur === val)
			})
		}, req.body)

		const trip = await TripsUseCases.find(req.params.id)
		if (!trip || trip.driverId !== req.authUser!.id) throw new NotAuthorizedError()

		const transaction = await TripsUseCases.detail({
			id: trip.id, driverId: trip.driverId,
			data: {
				...data, driverId: trip.driverId, managerId: trip.managerId,
				data: {
					type: TransactionType.trip,
					...data.data,
					tripId: trip.id,
					debt: data.amount - data.data.paidAmount,
				}
			}
		})
		if (transaction) return transaction
		throw new NotAuthorizedError()
	}
}