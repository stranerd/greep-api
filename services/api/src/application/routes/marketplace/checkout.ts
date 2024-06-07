import { Phone } from '@modules/auth'
import {
	CartLinksUseCases,
	CartsUseCases,
	OrderDispatchDeliveryType,
	OrderEntity,
	OrderFee,
	OrderPayment,
	OrderType,
	OrdersUseCases,
} from '@modules/marketplace'
import { ActivityEntity, ActivityType, EmbeddedUser, UsersUseCases, mergeWithUsers } from '@modules/users'
import { Location, LocationSchema } from '@utils/types'
import { ApiDef, BadRequestError, NotAuthorizedError, Router, Schema, Validation, validate } from 'equipped'

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

const router = new Router()

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
