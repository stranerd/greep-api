import { PaymentType, TransactionType, TripStatus, TripsUseCases } from '@modules/trips'
import { ActivityEntity, ActivityType, UsersUseCases } from '@modules/users'
import { LocationSchema } from '@utils/types'
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	Request,
	Schema,
	ValidationError,
	validate,
} from 'equipped'

export class TripsController {
	static async getTrips(req: Request) {
		const query = req.query as QueryParams
		query.auth = [
			{ field: 'driverId', value: req.authUser!.id },
			{ field: 'status', value: TripStatus.created },
			{ field: 'customerId', value: req.authUser!.id },
		]
		query.authType = QueryKeys.or
		return await TripsUseCases.get(query)
	}

	static async getTripsAdmin(req: Request) {
		const query = req.query as QueryParams
		return await TripsUseCases.get(query)
	}

	static async findTrip(req: Request) {
		const trip = await TripsUseCases.find(req.params.id)
		if (!trip) throw new NotFoundError()
		const hasAccess = trip.driverId === req.authUser!.id || trip.customerId === req.authUser!.id || trip.status === TripStatus.created
		if (!hasAccess) throw new NotFoundError()
		return trip
	}

	static async findTripAdmin(req: Request) {
		const trip = await TripsUseCases.find(req.params.id)
		if (!trip) throw new NotFoundError()
		return trip
	}

	static async createTrip(req: Request) {
		const data = validate(
			{
				requestedDriverId: Schema.string().min(1).nullable(),
				from: LocationSchema(),
				to: LocationSchema(),
				discount: Schema.number().gte(0).lte(100),
			},
			req.body,
		)

		const customerId = req.authUser!.id
		const customer = await UsersUseCases.find(customerId)
		if (!customer) throw new BadRequestError('profile not found')
		const score = ActivityEntity.getScore({ type: ActivityType.tripDiscount, discount: data.discount, tripId: '' })
		if (customer.account.rankings.overall.value + score < 0) throw new BadRequestError('not enough points for this discount')

		if (data.requestedDriverId) {
			const driver = await UsersUseCases.find(data.requestedDriverId)
			if (!driver || driver.isDeleted() || !driver.isDriver()) throw new BadRequestError('driver not found')
		}

		return await TripsUseCases.create({
			...data,
			customerId,
			driverId: null,
			status: TripStatus.created,
			data: {
				[TripStatus.created]: { timestamp: Date.now() },
			},
		})
	}

	static async updateTrip(req: Request, status: TripStatus) {
		const trip = await TripsUseCases.find(req.params.id)
		if (!trip) throw new BadRequestError('trip not found')
		const supportedStatus = {
			[TripStatus.driverArrived]: TripStatus.driverAssigned,
			[TripStatus.started]: TripStatus.driverArrived,
			[TripStatus.ended]: TripStatus.started,
		}
		if (supportedStatus[status] !== trip.status)
			throw new ValidationError([
				{
					field: 'status',
					messages: ['cant update this trip with: ' + status],
				},
			])

		const updated = await TripsUseCases.update({
			id: trip.id,
			userId: req.authUser!.id,
			data: {
				status,
				data: { [status]: { timestamp: Date.now() } },
			},
		})

		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async cancelTrip(req: Request) {
		const updated = await TripsUseCases.cancel({ id: req.params.id, customerId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async detailTrip(req: Request) {
		const data = validate(
			{
				amount: Schema.number().gt(0),
				description: Schema.string(),
				recordedAt: Schema.time().max(Date.now()).asStamp(),
				data: Schema.object({
					paidAmount: Schema.number(),
					paymentType: Schema.in(Object.values(PaymentType)),
				}),
			},
			req.body,
		)

		const trip = await TripsUseCases.find(req.params.id)
		if (!trip || trip.driverId !== req.authUser!.id) throw new NotAuthorizedError()

		const transaction = await TripsUseCases.detail({
			id: trip.id,
			driverId: trip.driverId,
			data: {
				...data,
				driverId: trip.driverId,
				data: {
					...data.data,
					type: TransactionType.trip,
					customerId: trip.customerId,
					tripId: trip.id,
					debt: data.amount - data.data.paidAmount,
				},
			},
		})
		if (transaction) return transaction
		throw new NotAuthorizedError()
	}

	static async acceptRequestedTrip(req: Request) {
		const { accepted } = validate(
			{
				accepted: Schema.boolean(),
			},
			req.body,
		)

		const updated = await TripsUseCases.accept({
			id: req.params.id,
			driverId: req.authUser!.id,
			requested: true,
			accepted,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async acceptNonRequestedTrip(req: Request) {
		const updated = await TripsUseCases.accept({
			id: req.params.id,
			driverId: req.authUser!.id,
			requested: false,
			accepted: true,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
