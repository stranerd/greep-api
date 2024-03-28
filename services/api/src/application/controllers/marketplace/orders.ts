import { CartsUseCases, OrderDispatchDeliveryType, OrderPayment, OrderStatus, OrderType, OrdersUseCases } from '@modules/marketplace'
import { TransactionStatus, TransactionType, TransactionsUseCases, WalletsUseCases } from '@modules/payment'
import { ActivityEntity, ActivityType, UsersUseCases } from '@modules/users'
import { LocationSchema } from '@utils/types'
import {
	BadRequestError,
	Conditions,
	NotAuthorizedError,
	NotFoundError,
	QueryKeys,
	QueryParams,
	Request,
	Schema,
	Validation,
	validate,
} from 'equipped'

export class OrdersController {
	private static schema = () => ({
		to: LocationSchema(),
		dropoffNote: Schema.string(),
		time: Schema.object({
			date: Schema.time().min(Date.now()).asStamp(),
			time: Schema.string().custom((value) => {
				const [hours, minutes] = value.split(':').map((v) => parseInt(v))
				return [hours >= 0 && hours <= 23, minutes >= 0 && minutes <= 59].every(Boolean)
			}),
		}),
		discount: Schema.number().gte(0).lte(100),
		payment: Schema.in(Object.values(OrderPayment)),
	})

	private static async verifyUser(userId: string, discount: number) {
		const user = await UsersUseCases.find(userId)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		const score = ActivityEntity.getScore({ type: ActivityType.orderDiscount, discount, orderId: '' })
		if (user.account.rankings.overall.value + score < 0) throw new BadRequestError('not enough points for this discount')

		return { user }
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
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
		return await OrdersUseCases.get(query)
	}

	static async find(req: Request) {
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || ![order.userId, order.getVendorId(), order.driverId].includes(req.authUser!.id)) throw new NotFoundError()
		return order
	}

	static async checkout(req: Request) {
		const data = validate(
			{
				...this.schema(),
				cartId: Schema.string().min(1),
			},
			req.body,
		)

		const cart = await CartsUseCases.find(data.cartId)
		if (!cart || cart.userId !== req.authUser!.id) throw new NotAuthorizedError()

		const { user } = await this.verifyUser(cart.userId, data.discount)

		const vendor = await UsersUseCases.find(cart.vendorId)
		if (!vendor || user.isDeleted() || !vendor.account.vendorLocation) throw new BadRequestError('vendor not found')

		return await OrdersUseCases.checkout({
			...data,
			from: vendor.account.vendorLocation,
			userId: user.id,
			email: user.bio.email,
		})
	}

	static async dispatch(req: Request) {
		const data = validate(
			{
				...this.schema(),
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

		const { user } = await this.verifyUser(req.authUser!.id, data.discount)

		return await OrdersUseCases.create({
			...data,
			userId: user.id,
			email: user.bio.email,
			data: {
				...data.data,
				type: OrderType.dispatch,
			},
		})
	}

	static async accept(req: Request) {
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

		if (accepted) return accepted
		throw new NotAuthorizedError()
	}

	static async generateToken(req: Request) {
		return await OrdersUseCases.generateToken({
			id: req.params.id,
			userId: req.authUser!.id,
		})
	}

	static async complete(req: Request) {
		const { token } = validate(
			{
				token: Schema.string().min(1),
			},
			req.body,
		)

		const updated = await OrdersUseCases.complete({
			id: req.params.id,
			userId: req.authUser!.id,
			token,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async pay(req: Request) {
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || order.userId !== req.authUser!.id) throw new NotAuthorizedError()
		if (order.paid) throw new NotAuthorizedError('order is already paid for')
		if (order.payment !== OrderPayment.wallet) throw new NotAuthorizedError('order payment method is not supported')

		const transaction = await TransactionsUseCases.create({
			userId: order.userId,
			email: order.email,
			amount: 0 - order.totalFee,
			currency: order.price.currency,
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
	}

	static async assignDriver(req: Request) {
		const updated = await OrdersUseCases.assignDriver({
			id: req.params.id,
			driverId: req.authUser!.id,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async markPaid(req: Request) {
		const updated = await OrdersUseCases.markPaid({
			id: req.params.id,
			driverId: req.authUser!.id,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async cancel(req: Request) {
		const updated = await OrdersUseCases.cancel({
			id: req.params.id,
			userId: req.authUser!.id,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
