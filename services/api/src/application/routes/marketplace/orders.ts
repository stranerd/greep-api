import { isAuthenticated, isDriver } from '@application/middlewares'
import { Phone } from '@modules/auth'
import {
	CartLinksUseCases,
	CartsUseCases,
	OrderDispatchDeliveryType,
	OrderEntity,
	OrderFee,
	OrderPayment,
	OrderStatus,
	OrderType,
	OrdersUseCases,
} from '@modules/marketplace'
import { TransactionStatus, TransactionType, TransactionsUseCases, WalletsUseCases } from '@modules/payment'
import { ActivityEntity, ActivityType, EmbeddedUser, UsersUseCases, mergeWithUsers } from '@modules/users'
import { Location, LocationSchema } from '@utils/types'
import {
	ApiDef,
	BadRequestError,
	Conditions,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	Validation,
	validate,
} from 'equipped'

const schema = () => ({
	to: LocationSchema(),
	dropoffNote: Schema.string(),
	time: Schema.object({
		date: Schema.time().min(Date.now()).asStamp(),
		time: Schema.string().custom((value) => {
			const [hours, minutes] = value.split(':').map((v) => parseInt(v))
			return [hours >= 0 && hours <= 23, minutes >= 0 && minutes <= 59].every(Boolean)
		}),
	}),
	discount: Schema.number().gte(0),
	payment: Schema.in(Object.values(OrderPayment)),
})

const verifyUser = async (userId: string, discount: number) => {
	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

	const score = ActivityEntity.getScore({ type: ActivityType.orderDiscount, discount, orderId: '' })
	if (user.account.rankings.overall.value + score < 0) throw new BadRequestError('not enough points for this discount')

	return { user }
}

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
		results: await mergeWithUsers(result.results, (e) => e.getMembers()),
	}
})

router.get<OrdersFindRouteDef>({ path: '/:id', key: 'marketplace-orders-find' })(async (req) => {
	const order = await OrdersUseCases.find(req.params.id)
	if (!order || !order.getMembers().includes(req.authUser!.id)) throw new NotFoundError()
	return (await mergeWithUsers([order], (e) => e.getMembers()))[0]
})

router.post<OrdersCheckoutCartRouteDef>({ path: '/checkout', key: 'marketplace-orders-checkout-cart' })(async (req) => {
	const data = validate({ ...schema(), cartId: Schema.string().min(1) }, req.body)

	const cart = await CartsUseCases.find(data.cartId)
	if (!cart || cart.userId !== req.authUser!.id || !cart.active) throw new NotAuthorizedError()

	const { user } = await verifyUser(cart.userId, data.discount)

	const vendor = await UsersUseCases.find(cart.vendorId)
	if (!vendor || vendor.isDeleted()) throw new BadRequestError('vendor not found')
	if (!vendor.vendor?.location) throw new BadRequestError('vendor failed to set their location')

	const order = await OrdersUseCases.checkout({
		...data,
		from: vendor.vendor.location,
		userId: user.id,
		email: user.bio.email,
	})
	return (await mergeWithUsers([order], (e) => e.getMembers()))[0]
})

router.post<OrdersCheckoutCartFeeRouteDef>({ path: '/checkout/fee', key: 'marketplace-orders-checkout-cart-fee' })(async (req) => {
	const data = validate({ ...schema(), cartId: Schema.string().min(1) }, req.body)

	const cart = await CartsUseCases.find(data.cartId)
	if (!cart || cart.userId !== req.authUser!.id || !cart.active) throw new NotAuthorizedError()

	const vendor = await UsersUseCases.find(cart.vendorId)
	if (!vendor || vendor.isDeleted()) throw new BadRequestError('vendor not found')
	if (!vendor.vendor?.location) throw new BadRequestError('vendor failed to set their location')

	return await OrderEntity.calculateFees({
		...data,
		from: vendor.vendor.location,
		userId: cart.userId,
		data: {
			type: OrderType.cart,
			cartId: cart.id,
			products: cart.products,
			vendorId: cart.vendorId,
		},
	})
})

router.post<OrdersCheckoutCartLinkRouteDef>({ path: '/checkout/links', key: 'marketplace-orders-checkout-cart-link' })(async (req) => {
	const data = validate({ cartLinkId: Schema.string().min(1) }, req.body)

	const cartLink = await CartLinksUseCases.find(data.cartLinkId)
	if (!cartLink || !cartLink.active) throw new NotAuthorizedError()

	const { user } = await verifyUser(req.authUser!.id, 0)

	const vendor = await UsersUseCases.find(cartLink.vendorId)
	if (!vendor || vendor.isDeleted()) throw new BadRequestError('vendor not found')
	if (!vendor.vendor?.location) throw new BadRequestError('vendor failed to set their location')

	const order = await OrdersUseCases.checkout({
		cartLinkId: cartLink.id,
		to: cartLink.to,
		payment: cartLink.payment,
		discount: 0,
		dropoffNote: '',
		time: cartLink.time,
		from: vendor.vendor.location,
		userId: user.id,
		email: user.bio.email,
	})
	return (await mergeWithUsers([order], (e) => e.getMembers()))[0]
})

router.post<OrdersCheckoutCartLinkFeeRouteDef>({ path: '/checkout/links/fee', key: 'marketplace-orders-checkout-cart-link-fee' })(
	async (req) => {
		const data = validate({ cartLinkId: Schema.string().min(1) }, req.body)

		const cartLink = await CartLinksUseCases.find(data.cartLinkId)
		if (!cartLink || !cartLink.active) throw new NotAuthorizedError()

		const vendor = await UsersUseCases.find(cartLink.vendorId)
		if (!vendor || vendor.isDeleted()) throw new BadRequestError('vendor not found')
		if (!vendor.vendor?.location) throw new BadRequestError('vendor failed to set their location')

		return await OrderEntity.calculateFees({
			from: vendor.vendor.location,
			to: cartLink.to,
			discount: 0,
			payment: cartLink.payment,
			time: cartLink.time,
			userId: req.authUser!.id,
			data: {
				type: OrderType.cartLink,
				cartLinkId: cartLink.id,
				products: cartLink.products,
				vendorId: cartLink.vendorId,
			},
		})
	},
)

router.post<OrdersDispatchRouteDef>({ path: '/dispatch', key: 'marketplace-orders-dispatch' })(async (req) => {
	const data = validate(
		{
			...schema(),
			from: LocationSchema(),
			data: Schema.object({
				deliveryType: Schema.in(Object.values(OrderDispatchDeliveryType)),
				description: Schema.string(),
				size: Schema.number().gte(0),
				recipientName: Schema.string().min(1),
				recipientPhone: Schema.any().addRule(Validation.isValidPhone()),
			}),
		},
		req.body,
	)

	const { user } = await verifyUser(req.authUser!.id, data.discount)

	const order = await OrdersUseCases.create({
		...data,
		userId: user.id,
		email: user.bio.email,
		data: {
			...data.data,
			type: OrderType.dispatch,
		},
	})
	return (await mergeWithUsers([order], (e) => e.getMembers()))[0]
})

router.post<OrdersDispatchFeeRouteDef>({ path: '/dispatch/fee', key: 'marketplace-orders-dispatch-fee' })(async (req) => {
	const data = validate(
		{
			...schema(),
			from: LocationSchema(),
			data: Schema.object({
				deliveryType: Schema.in(Object.values(OrderDispatchDeliveryType)),
				description: Schema.string(),
				size: Schema.number().gte(0),
				recipientName: Schema.string().min(1),
				recipientPhone: Schema.any().addRule(Validation.isValidPhone()),
			}),
		},
		req.body,
	)

	return await OrderEntity.calculateFees({
		...data,
		userId: req.authUser!.id,
		data: {
			...data.data,
			type: OrderType.dispatch,
		},
	})
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

	if (accepted) return (await mergeWithUsers([accepted], (e) => e.getMembers()))[0]
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
	if (updated) return (await mergeWithUsers([updated], (e) => e.getMembers()))[0]
	throw new NotAuthorizedError()
})

router.post<OrdersPayRouteDef>({ path: '/:id/pay', key: 'marketplace-orders-pay' })(async (req) => {
	const order = await OrdersUseCases.find(req.params.id)
	if (!order || order.userId !== req.authUser!.id) throw new NotAuthorizedError()
	if (order.paid) throw new NotAuthorizedError('order is already paid for')
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
		if (updated) return (await mergeWithUsers([updated], (e) => e.getMembers()))[0]
		throw new NotAuthorizedError()
	},
)

router.post<OrdersMarkPaidRouteDef>({ path: '/:id/markPaid', key: 'marketplace-orders-mark-paid', middlewares: [isDriver] })(
	async (req) => {
		const updated = await OrdersUseCases.markPaid({
			id: req.params.id,
			driverId: req.authUser!.id,
		})
		if (updated) return (await mergeWithUsers([updated], (e) => e.getMembers()))[0]
		throw new NotAuthorizedError()
	},
)

router.post<OrdersMarkShippedRouteDef>({ path: '/:id/markShipped', key: 'marketplace-orders-mark-shipped' })(async (req) => {
	const updated = await OrdersUseCases.markShipped({
		id: req.params.id,
		userId: req.authUser!.id,
	})
	if (updated) return (await mergeWithUsers([updated], (e) => e.getMembers()))[0]
	throw new NotAuthorizedError()
})

router.post<OrdersCancelRouteDef>({ path: '/:id/cancel', key: 'marketplace-orders-cancel' })(async (req) => {
	const updated = await OrdersUseCases.cancel({
		id: req.params.id,
		userId: req.authUser!.id,
	})
	if (updated) return (await mergeWithUsers([updated], (e) => e.getMembers()))[0]
	throw new NotAuthorizedError()
})

export default router

type Order = OrderEntity & { users: EmbeddedUser[] }

type CreateOrderBase = {
	to: Location
	dropoffNote: string
	time: { date: number; time: string }
	discount: number
	payment: OrderPayment
}
type CheckoutOrder = CreateOrderBase & { cardId: string }
type DispatchOrder = CreateOrderBase & {
	from: Location
	data: {
		deliveryType: OrderDispatchDeliveryType
		description: string
		size: number
		recipientName: string
		recipientPhone: Phone
	}
}

type OrdersGetRouteDef = ApiDef<{
	key: 'marketplace-orders-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<Order>
}>

type OrdersFindRouteDef = ApiDef<{
	key: 'marketplace-orders-find'
	method: 'get'
	params: { id: string }
	response: Order
}>

type OrdersCheckoutCartRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart'
	method: 'post'
	body: CheckoutOrder
	response: Order
}>

type OrdersCheckoutCartFeeRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart-fee'
	method: 'post'
	body: CheckoutOrder
	response: OrderFee
}>

type OrdersCheckoutCartLinkRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart-link'
	method: 'post'
	body: { cartLinkId: string }
	response: Order
}>

type OrdersCheckoutCartLinkFeeRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart-link-fee'
	method: 'post'
	body: { cartLinkId: string }
	response: OrderFee
}>

type OrdersDispatchRouteDef = ApiDef<{
	key: 'marketplace-orders-dispatch'
	method: 'post'
	body: DispatchOrder
	response: Order
}>

type OrdersDispatchFeeRouteDef = ApiDef<{
	key: 'marketplace-orders-dispatch-fee'
	method: 'post'
	body: DispatchOrder
	response: OrderFee
}>

type OrdersAcceptRouteDef = ApiDef<{
	key: 'marketplace-orders-accept'
	method: 'post'
	params: { id: string }
	body: { accepted: boolean; message: string }
	response: Order
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
	response: Order
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
	response: Order
}>

type OrdersMarkPaidRouteDef = ApiDef<{
	key: 'marketplace-orders-mark-paid'
	method: 'post'
	params: { id: string }
	response: Order
}>

type OrdersMarkShippedRouteDef = ApiDef<{
	key: 'marketplace-orders-mark-shipped'
	method: 'post'
	params: { id: string }
	response: Order
}>

type OrdersCancelRouteDef = ApiDef<{
	key: 'marketplace-orders-cancel'
	method: 'post'
	params: { id: string }
	response: Order
}>
