import { PaymentType, TransactionType, TripStatus, TripsUseCases, UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	Request,
	validate,
	Validation,
	ValidationError
} from '@stranerd/api-commons'

const isValidCoords = (val: any) => {
	const valid = [
		Validation.isArrayOf(val, (cur) => Validation.isNumber(cur).valid, 'coords').valid,
		Validation.hasLessThan(val, 3).valid,
		Validation.hasMoreThan(val, 1).valid
	].every((v) => v)
	return valid ? Validation.isValid() : Validation.isInvalid('not a valid coordinate')
}

export class TripsController {
	static async getTrips (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }, { field: 'managerId', value: req.authUser!.id }]
		query.authType = QueryKeys.or
		return await TripsUseCases.get(query)
	}

	static async findTrip (req: Request) {
		const trip = await TripsUseCases.find(req.params.id)
		if (!trip || ![trip.managerId, trip.driverId].includes(req.authUser!.id)) throw new NotFoundError()
		return trip
	}

	static async createTrip (req: Request) {
		const { coords, location } = validate({
			coords: req.body.coords,
			location: req.body.location
		}, {
			coords: { required: true, rules: [isValidCoords] },
			location: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const driverId = req.authUser!.id
		const driver = await UsersUseCases.find(driverId)
		if (!driver) throw new BadRequestError('profile not found')

		return await TripsUseCases.create({
			driverId, managerId: driver.manager?.managerId ?? driverId,
			status: TripStatus.gotten,
			data: {
				[TripStatus.gotten]: { timestamp: Date.now(), coords, location }
			}
		})
	}

	static async updateTrip (req: Request, status: TripStatus) {
		const { coords, location } = validate({
			coords: req.body.coords,
			location: req.body.location
		}, {
			coords: { required: true, rules: [isValidCoords] },
			location: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

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
					[status]: { timestamp: Date.now(), coords, location }
				}
			}
		})

		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async detailTrip (req: Request) {
		const {
			amount,
			description,
			recordedAt,
			customerName,
			paidAmount,
			paymentType
		} = validate({
			amount: req.body.amount,
			description: req.body.description,
			recordedAt: req.body.recordedAt,
			paidAmount: req.body.data?.paidAmount,
			customerName: req.body.data?.customerName,
			paymentType: req.body.data?.paymentType
		}, {
			amount: { required: true, rules: [Validation.isNumber, Validation.isMoreThanX(0)] },
			description: { required: true, rules: [Validation.isString] },
			recordedAt: { required: true, rules: [Validation.isNumber, Validation.isMoreThanX(0)] },
			customerName: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			paidAmount: { required: true, rules: [Validation.isNumber] },
			paymentType: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values(PaymentType), (cur, val) => cur === val)]
			}
		})

		const trip = await TripsUseCases.find(req.params.id)
		if (!trip || trip.driverId !== req.authUser!.id) throw new NotAuthorizedError()

		const transaction = await TripsUseCases.detail({
			id: trip.id, driverId: trip.driverId,
			data: {
				amount, description, recordedAt, driverId: trip.driverId, managerId: trip.managerId,
				data: {
					type: TransactionType.trip,
					tripId: trip.id,
					customerName,
					paidAmount,
					debt: amount - paidAmount,
					paymentType
				}
			}
		})
		if (transaction) return transaction
		throw new NotAuthorizedError()
	}
}