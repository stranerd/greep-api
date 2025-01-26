import { isAuthenticated, isDriver } from '@application/middlewares'
import { PaymentType, TransactionEntity, TransactionType, TripEntity, TripStatus, TripsUseCases } from '@modules/trips'
import { ActivityEntity, ActivityType, UsersUseCases } from '@modules/users'
import { LocationInput, LocationSchema } from '@utils/types'
import {
	ApiDef,
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	ValidationError,
	validate,
} from 'equipped'

async function updateTrip(tripId: string, userId: string, status: TripStatus) {
	const trip = await TripsUseCases.find(tripId)
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
		userId,
		data: {
			status,
			data: { [status]: { timestamp: Date.now() } },
		},
	})

	if (updated) return updated
	throw new NotAuthorizedError()
}

const router = new Router({ path: '/trips', groups: ['Trips'], middlewares: [isAuthenticated] })

router.get<TripsGetRouteDef>({ path: '/', key: 'trips-trips-get' })(async (req) => {
	const query = req.query as QueryParams
	query.auth = [
		{ field: 'driverId', value: req.authUser!.id },
		{ field: 'status', value: TripStatus.created },
		{ field: 'customerId', value: req.authUser!.id },
	]
	query.authType = QueryKeys.or
	return await TripsUseCases.get(query)
})

router.get<TripsFindRouteDef>({ path: '/:id', key: 'trips-trips-find' })(async (req) => {
	const trip = await TripsUseCases.find(req.params.id)
	if (!trip) throw new NotFoundError()
	const hasAccess = trip.driverId === req.authUser!.id || trip.customerId === req.authUser!.id || trip.status === TripStatus.created
	if (!hasAccess) throw new NotFoundError()
	return trip
})

router.post<TripsCreateRouteDef>({ path: '/', key: 'trips-trips-create' })(async (req) => {
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
})

router.post<TripsDriverArriveRouteDef>({ path: '/:id/driverArrive', key: 'trips-trips-driver-arrive' })(async (req) =>
	updateTrip(req.params.id, req.authUser!.id, TripStatus.driverArrived),
)

router.post<TripsStartRouteDef>({ path: '/:id/start', key: 'trips-trips-start' })(async (req) =>
	updateTrip(req.params.id, req.authUser!.id, TripStatus.started),
)

router.post<TripsEndRouteDef>({ path: '/:id/end', key: 'trips-trips-end' })(async (req) =>
	updateTrip(req.params.id, req.authUser!.id, TripStatus.ended),
)

router.post<TripsCancelRouteDef>({ path: '/:id/cancel', key: 'trips-trips-cancel' })(async (req) => {
	const updated = await TripsUseCases.cancel({ id: req.params.id, customerId: req.authUser!.id })
	if (updated) return updated
	throw new NotAuthorizedError()
})

router.post<TripsDetailRouteDef>({ path: '/:id/detail', key: 'trips-trips-detail' })(async (req) => {
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
	const customer = await UsersUseCases.find(trip.customerId)

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
				customerName: customer?.bio.name.full ?? trip.customerId,
				tripId: trip.id,
				debt: data.amount - data.data.paidAmount,
			},
		},
	})
	if (transaction) return transaction
	throw new NotAuthorizedError()
})

router.post<TripsAcceptRequestedRouteDef>({ path: '/:id/accept/requested', key: 'trips-trips-accept-requested' })(async (req) => {
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
})

router.post<TripsAcceptNonRequestedRouteDef>({
	path: '/:id/accept/nonrequested',
	key: 'trips-trips-accept-non-requested',
	middlewares: [isDriver],
})(async (req) => {
	const updated = await TripsUseCases.accept({
		id: req.params.id,
		driverId: req.authUser!.id,
		requested: false,
		accepted: true,
	})
	if (updated) return updated
	throw new NotAuthorizedError()
})

export default router

type TripsGetRouteDef = ApiDef<{
	key: 'trips-trips-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<TripEntity>
}>

type TripsFindRouteDef = ApiDef<{
	key: 'trips-trips-find'
	method: 'get'
	params: { id: string }
	response: TripEntity
}>

type TripsCreateRouteDef = ApiDef<{
	key: 'trips-trips-create'
	method: 'post'
	body: { requestedDriverId: string | null; from: LocationInput; to: LocationInput; discount: number }
	response: TripEntity
}>

type TripsDriverArriveRouteDef = ApiDef<{
	key: 'trips-trips-driver-arrive'
	method: 'post'
	params: { id: string }
	response: TripEntity
}>

type TripsStartRouteDef = ApiDef<{
	key: 'trips-trips-start'
	method: 'post'
	params: { id: string }
	response: TripEntity
}>

type TripsEndRouteDef = ApiDef<{
	key: 'trips-trips-end'
	method: 'post'
	params: { id: string }
	response: TripEntity
}>

type TripsCancelRouteDef = ApiDef<{
	key: 'trips-trips-cancel'
	method: 'post'
	params: { id: string }
	response: TripEntity
}>

type TripsDetailRouteDef = ApiDef<{
	key: 'trips-trips-detail'
	method: 'post'
	params: { id: string }
	body: { amount: number; description: string; recordedAt: number; data: { paidAmount: number; paymentType: PaymentType } }
	response: TransactionEntity
}>

type TripsAcceptRequestedRouteDef = ApiDef<{
	key: 'trips-trips-accept-requested'
	method: 'post'
	params: { id: string }
	body: { accepted: boolean }
	response: TripEntity
}>

type TripsAcceptNonRequestedRouteDef = ApiDef<{
	key: 'trips-trips-accept-non-requested'
	method: 'post'
	params: { id: string }
	response: TripEntity
}>
