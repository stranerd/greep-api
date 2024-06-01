import { isAuthenticated } from '@application/middlewares'
import { PaymentType, TransactionEntity, TransactionToModel, TransactionType, TransactionsUseCases } from '@modules/trips'
import { UsersUseCases } from '@modules/users'
import {
	ApiDef,
	BadRequestError,
	DeepOmit,
	DistributiveOmit,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

const router = new Router({ path: '/transactions', groups: ['Transactions'], middlewares: [isAuthenticated] })

router.get<TripsTransactionsGetRouteDef>({ path: '/', key: 'trips-transactions-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'driverId', value: req.authUser!.id }]
	return await TransactionsUseCases.get(query)
})

router.post<TripsTransactionsCreateRouteDef>({ path: '/', key: 'trips-transactions-create' })(async (req) => {
	const isBalance = req.body.data?.type === TransactionType.balance

	const data = validate(
		{
			amount: Schema.number().gt(isBalance ? Number.NEGATIVE_INFINITY : 0),
			description: Schema.string(),
			recordedAt: Schema.time().max(Date.now()).asStamp(),
			data: Schema.discriminate((v) => v.type, {
				[TransactionType.expense]: Schema.object({
					type: Schema.is(TransactionType.expense as const),
					name: Schema.string().min(1),
				}),
				[TransactionType.balance]: Schema.object({
					type: Schema.is(TransactionType.balance as const),
					parentId: Schema.string().min(1),
				}),
				[TransactionType.trip]: Schema.object({
					type: Schema.is(TransactionType.trip as const),
					customerId: Schema.string().min(1).nullable(),
					customerName: Schema.string().min(1),
					paidAmount: Schema.number(),
					paymentType: Schema.any<PaymentType>().in(Object.values(PaymentType)).default(PaymentType.cash),
				}),
			}),
		},
		req.body,
	)

	const driverId = req.authUser!.id
	const driver = await UsersUseCases.find(driverId)
	if (!driver) throw new BadRequestError('profile not found')

	if (data.data.type === TransactionType.balance) {
		const parent = await TransactionsUseCases.find(data.data.parentId)
		if (!parent) throw new BadRequestError('parent transaction not found')
		if (parent.driverId !== driverId) throw new BadRequestError('parent transaction isnt yours')
		if (parent.data.type !== TransactionType.trip) throw new BadRequestError('parent transaction is not a trip')
		if (parent.data.debt === 0) throw new BadRequestError('parent transaction is settled already')
		if (Math.abs(parent.data.debt) < Math.abs(data.amount)) throw new BadRequestError('amount is greater than the debt to settle')
	}

	if (data.data.type === TransactionType.trip && data.data.customerId) {
		const customer = await UsersUseCases.find(data.data.customerId)
		if (!customer || customer.isDeleted()) throw new BadRequestError('customer not found')
		data.data.customerName = customer.bio.name.full
	}

	return await TransactionsUseCases.create({
		...data,
		driverId,
		data:
			data.data.type === TransactionType.trip
				? {
						...data.data,
						tripId: null,
						debt: data.amount - data.data.paidAmount,
					}
				: data.data,
	})
})

router.get<TripsTransactionsFindRouteDef>({ path: '/:id', key: 'trips-transactions-find' })(async (req) => {
	const transaction = await TransactionsUseCases.find(req.params.id)
	if (!transaction || transaction.driverId !== req.authUser!.id) throw new NotFoundError()
	return transaction
})

router.delete<TripsTransactionsDeleteRouteDef>({ path: '/:id', key: 'trips-transactions-delete' })(async (req) => {
	const isDeleted = await TransactionsUseCases.delete({ id: req.params.id, driverId: req.authUser!.id })
	if (isDeleted) return isDeleted
	throw new NotAuthorizedError()
})

export default router

type TripsTransactionsGetRouteDef = ApiDef<{
	key: 'trips-transactions-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<TransactionEntity>
}>

type TripsTransactionsCreateRouteDef = ApiDef<{
	key: 'trips-transactions-create'
	method: 'post'
	body: DeepOmit<TransactionToModel, 'driverId' | 'data'> & { data: DistributiveOmit<TransactionToModel['data'], 'tripId' | 'debt'> }
	response: TransactionEntity
}>

type TripsTransactionsFindRouteDef = ApiDef<{
	key: 'trips-transactions-find'
	method: 'get'
	params: { id: string }
	response: TransactionEntity
}>

type TripsTransactionsDeleteRouteDef = ApiDef<{
	key: 'trips-transactions-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
