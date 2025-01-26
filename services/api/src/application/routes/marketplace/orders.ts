import { isAuthenticated, isDriver } from '@application/middlewares'
import { mergeOrdersData, OrderEntity, OrderPayment, OrderStatus, OrdersUseCases } from '@modules/marketplace'
import { TransactionStatus, TransactionsUseCases, TransactionType, WalletsUseCases } from '@modules/payment'
import {
	ApiDef,
	Conditions,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

const router = new Router({ path: '/orders', groups: ['Orders'], middlewares: [isAuthenticated] })

router.get<OrdersGetRouteDef>({ path: '/', key: 'marketplace-orders-get' })(async (req) => {
	const query = req.query
	query.authType = QueryKeys.or
	query.auth = [
		{ field: 'userId', value: req.authUser!.id },
		{ field: 'data.vendorId', value: req.authUser!.id },
		{ field: 'driverId', value: req.authUser!.id },
	]
	if (req.authUser!.roles.isDriver)
		query.auth!.push({
			condition: QueryKeys.and,
			value: [
				{ field: `status.${OrderStatus.accepted}`, condition: Conditions.ne, value: null },
				{ field: 'driverId', value: null },
			],
		})
	const result = await OrdersUseCases.get(query)
	return {
		...result,
		results: await mergeOrdersData(result.results),
	}
})

router.get<OrdersFindRouteDef>({ path: '/:id', key: 'marketplace-orders-find' })(async (req) => {
	const order = await OrdersUseCases.find(req.params.id)
	if (!order || !order.getMembers().includes(req.authUser!.id)) throw new NotFoundError()
	return await mergeOrdersData([order]).then((res) => res[0])
})

router.post<OrdersAcceptRouteDef>({ path: '/:id/accept', key: 'marketplace-orders-accept' })(async (req) => {
	const data = validate(
		{
			accepted: Schema.boolean(),
			message: Schema.string(),
		},
		req.body,
	)

	const accepted = await OrdersUseCases.accept({
		...data,
		id: req.params.id,
		userId: req.authUser!.id,
	})

	if (accepted) return await mergeOrdersData([accepted]).then((res) => res[0])
	throw new NotAuthorizedError()
})

router.post<OrdersGenerateTokenRouteDef>({ path: '/:id/token', key: 'marketplace-orders-generate-token' })(
	async (req) =>
		await OrdersUseCases.generateToken({
			id: req.params.id,
			userId: req.authUser!.id,
		}),
)

router.post<OrdersCompleteRouteDef>({ path: '/:id/complete', key: 'marketplace-orders-complete' })(async (req) => {
	const { token } = validate({ token: Schema.string().min(1) }, req.body)

	const updated = await OrdersUseCases.complete({
		id: req.params.id,
		userId: req.authUser!.id,
		token,
	})
	if (updated) return await mergeOrdersData([updated]).then((res) => res[0])
	throw new NotAuthorizedError()
})

router.post<OrdersPayRouteDef>({ path: '/:id/pay', key: 'marketplace-orders-pay' })(async (req) => {
	const order = await OrdersUseCases.find(req.params.id)
	if (!order || order.userId !== req.authUser!.id) throw new NotAuthorizedError()
	if (order.getPaid()) throw new NotAuthorizedError('order is already paid for')
	if (order.payment !== OrderPayment.wallet) throw new NotAuthorizedError('order payment method is not supported')

	const transaction = await TransactionsUseCases.create({
		userId: order.userId,
		email: order.email,
		amount: 0 - order.fee.payable,
		currency: order.fee.currency,
		status: TransactionStatus.initialized,
		title: `Payment for order #${order.id}`,
		data: {
			type: TransactionType.OrderPayment,
			orderId: order.id,
		},
	})

	const successful = await WalletsUseCases.updateAmount({
		userId: transaction.userId,
		amount: transaction.amount,
		currency: transaction.currency,
	})

	await TransactionsUseCases.update({
		id: transaction.id,
		data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed },
	})

	return successful
})

router.post<OrdersAssignDriverRouteDef>({ path: '/:id/assignDriver', key: 'marketplace-orders-assign-driver', middlewares: [isDriver] })(
	async (req) => {
		const updated = await OrdersUseCases.assignDriver({
			id: req.params.id,
			driverId: req.authUser!.id,
		})
		if (updated) return await mergeOrdersData([updated]).then((res) => res[0])
		throw new NotAuthorizedError()
	},
)

router.post<OrdersMarkPaidRouteDef>({ path: '/:id/markPaid', key: 'marketplace-orders-mark-paid', middlewares: [isDriver] })(
	async (req) => {
		const updated = await OrdersUseCases.markPaid({
			id: req.params.id,
			driverId: req.authUser!.id,
		})
		if (updated) return await mergeOrdersData([updated]).then((res) => res[0])
		throw new NotAuthorizedError()
	},
)

router.post<OrdersMarkShippedRouteDef>({ path: '/:id/markShipped', key: 'marketplace-orders-mark-shipped' })(async (req) => {
	const updated = await OrdersUseCases.markShipped({
		id: req.params.id,
		userId: req.authUser!.id,
	})
	if (updated) return await mergeOrdersData([updated]).then((res) => res[0])
	throw new NotAuthorizedError()
})

router.post<OrdersCancelRouteDef>({ path: '/:id/cancel', key: 'marketplace-orders-cancel' })(async (req) => {
	const updated = await OrdersUseCases.cancel({
		id: req.params.id,
		userId: req.authUser!.id,
	})
	if (updated) return await mergeOrdersData([updated]).then((res) => res[0])
	throw new NotAuthorizedError()
})

export default router

type OrdersGetRouteDef = ApiDef<{
	key: 'marketplace-orders-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<OrderEntity>
}>

type OrdersFindRouteDef = ApiDef<{
	key: 'marketplace-orders-find'
	method: 'get'
	params: { id: string }
	response: OrderEntity
}>

type OrdersAcceptRouteDef = ApiDef<{
	key: 'marketplace-orders-accept'
	method: 'post'
	params: { id: string }
	body: { accepted: boolean; message: string }
	response: OrderEntity
}>

type OrdersGenerateTokenRouteDef = ApiDef<{
	key: 'marketplace-orders-generate-token'
	method: 'post'
	params: { id: string }
	response: string
}>

type OrdersCompleteRouteDef = ApiDef<{
	key: 'marketplace-orders-complete'
	method: 'post'
	params: { id: string }
	body: { token: string }
	response: OrderEntity
}>

type OrdersPayRouteDef = ApiDef<{
	key: 'marketplace-orders-pay'
	method: 'post'
	params: { id: string }
	response: boolean
}>

type OrdersAssignDriverRouteDef = ApiDef<{
	key: 'marketplace-orders-assign-driver'
	method: 'post'
	params: { id: string }
	body: { driverId: string }
	response: OrderEntity
}>

type OrdersMarkPaidRouteDef = ApiDef<{
	key: 'marketplace-orders-mark-paid'
	method: 'post'
	params: { id: string }
	response: OrderEntity
}>

type OrdersMarkShippedRouteDef = ApiDef<{
	key: 'marketplace-orders-mark-shipped'
	method: 'post'
	params: { id: string }
	response: OrderEntity
}>

type OrdersCancelRouteDef = ApiDef<{
	key: 'marketplace-orders-cancel'
	method: 'post'
	params: { id: string }
	response: OrderEntity
}>
