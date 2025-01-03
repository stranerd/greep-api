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
	PromotionsUseCases,
	mergeOrdersData,
} from '@modules/marketplace'
import { ActivityEntity, ActivityType, UserType, UsersUseCases, isVendorOpen } from '@modules/users'
import { LocationInput, LocationSchema } from '@utils/types'
import { ApiDef, BadRequestError, Conditions, NotAuthorizedError, Router, Schema, Validation, validate } from 'equipped'

const schema = () => ({
	to: LocationSchema(),
	dropoffNote: Schema.string(),
	time: Schema.undefined()
		.optional()
		.transform(() => Date.now()),
	// time: Schema.time().min(Date.now()).asStamp(),
	discount: Schema.number().gte(0),
	payment: Schema.in(Object.values(OrderPayment)),
	promotionIds: Schema.array(Schema.string()).default([]),
})

const getVendorLocation = async (vendorId: string) => {
	const vendor = await UsersUseCases.find(vendorId)
	if (!vendor || vendor.type?.type !== UserType.vendor || vendor.isDeleted()) throw new BadRequestError('vendor not found')
	if (!isVendorOpen(vendor.vendor.schedule)) throw new BadRequestError('vendor is closed at the moment')
	return vendor.type.location
}

const getPromotions = async (promotionIds: string[]) =>
	PromotionsUseCases.get({
		where: [{ field: 'id', condition: Conditions.in, value: promotionIds }],
		all: true,
	}).then((res) => res.results)

const verifyUser = async (userId: string, discount: number) => {
	const user = await UsersUseCases.find(userId)
	if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

	const score = ActivityEntity.getScore({ type: ActivityType.orderDiscount, discount, orderId: '' })
	// if (user.account.rankings.overall.value + score < 0) throw new BadRequestError('not enough points for this discount')
	if (user.account.rankings.overall.value + score < 0) return { user }

	return { user }
}

const router = new Router()

router.post<OrdersCheckoutCartRouteDef>({ path: '/checkout', key: 'marketplace-orders-checkout-cart' })(async (req) => {
	const data = validate({ ...schema(), cartId: Schema.string().min(1) }, req.body)

	const cart = await CartsUseCases.find(data.cartId)
	if (!cart || cart.userId !== req.authUser!.id || !cart.active) throw new NotAuthorizedError()

	const { user } = await verifyUser(cart.userId, data.discount)

	const order = await OrdersUseCases.checkout({
		...data,
		from: await getVendorLocation(cart.vendorId),
		userId: user.id,
		email: user.bio.email,
	})
	return await mergeOrdersData([order]).then((res) => res[0])
})

router.post<OrdersCheckoutCartFeeRouteDef>({ path: '/checkout/fee', key: 'marketplace-orders-checkout-cart-fee' })(async (req) => {
	const data = validate({ ...schema(), cartId: Schema.string().min(1) }, req.body)

	const cart = await CartsUseCases.find(data.cartId)
	if (!cart || cart.userId !== req.authUser!.id || !cart.active) throw new NotAuthorizedError()

	return await OrderEntity.calculateFees(
		{
			...data,
			from: await getVendorLocation(cart.vendorId),
			userId: cart.userId,
			data: {
				type: OrderType.cart,
				cartId: cart.id,
				packs: cart.packs,
				vendorId: cart.vendorId,
				vendorType: cart.vendorType,
			},
		},
		await getPromotions(data.promotionIds),
	)
})

router.post<OrdersCheckoutCartLinkRouteDef>({ path: '/checkout/links', key: 'marketplace-orders-checkout-cart-link' })(async (req) => {
	const data = validate({ ...schema(), cartLinkId: Schema.string().min(1) }, req.body)

	const cartLink = await CartLinksUseCases.find(data.cartLinkId)
	if (!cartLink || !cartLink.active) throw new NotAuthorizedError()

	const { user } = await verifyUser(req.authUser!.id, 0)

	const order = await OrdersUseCases.checkout({
		...data,
		from: await getVendorLocation(cartLink.vendorId),
		userId: user.id,
		email: user.bio.email,
	})
	return await mergeOrdersData([order]).then((res) => res[0])
})

router.post<OrdersCheckoutCartLinkFeeRouteDef>({ path: '/checkout/links/fee', key: 'marketplace-orders-checkout-cart-link-fee' })(
	async (req) => {
		const data = validate({ ...schema(), cartLinkId: Schema.string().min(1) }, req.body)

		const cartLink = await CartLinksUseCases.find(data.cartLinkId)
		if (!cartLink || !cartLink.active) throw new NotAuthorizedError()

		return await OrderEntity.calculateFees(
			{
				...data,
				from: await getVendorLocation(cartLink.vendorId),
				userId: req.authUser!.id,
				data: {
					type: OrderType.cartLink,
					cartLinkId: cartLink.id,
					packs: cartLink.packs,
					vendorId: cartLink.vendorId,
					vendorType: cartLink.vendorType,
				},
			},
			await getPromotions(data.promotionIds),
		)
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
	return await mergeOrdersData([order]).then((res) => res[0])
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

	return await OrderEntity.calculateFees(
		{
			...data,
			userId: req.authUser!.id,
			data: {
				...data.data,
				type: OrderType.dispatch,
			},
		},
		await getPromotions(data.promotionIds),
	)
})

export default router

type CreateOrderBase = {
	to: LocationInput
	dropoffNote: string
	time: number
	discount: number
	payment: OrderPayment
}
type CheckoutCartOrder = CreateOrderBase & { cardId: string }
type CheckoutCartLinkOrder = CreateOrderBase & { cardLinkId: string }
type DispatchOrder = CreateOrderBase & {
	from: LocationInput
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
	body: CheckoutCartOrder
	response: OrderEntity
}>

type OrdersCheckoutCartFeeRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart-fee'
	method: 'post'
	body: CheckoutCartOrder
	response: OrderFee
}>

type OrdersCheckoutCartLinkRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart-link'
	method: 'post'
	body: CheckoutCartLinkOrder
	response: OrderEntity
}>

type OrdersCheckoutCartLinkFeeRouteDef = ApiDef<{
	key: 'marketplace-orders-checkout-cart-link-fee'
	method: 'post'
	body: CheckoutCartLinkOrder
	response: OrderFee
}>

type OrdersDispatchRouteDef = ApiDef<{
	key: 'marketplace-orders-dispatch'
	method: 'post'
	body: DispatchOrder
	response: OrderEntity
}>

type OrdersDispatchFeeRouteDef = ApiDef<{
	key: 'marketplace-orders-dispatch-fee'
	method: 'post'
	body: DispatchOrder
	response: OrderFee
}>
