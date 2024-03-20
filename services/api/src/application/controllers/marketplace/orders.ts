import { OrderStatus, OrdersUseCases } from '@modules/marketplace'
import { Currencies, FlutterwavePayment, TransactionStatus, TransactionType, TransactionsUseCases, WalletsUseCases } from '@modules/payment'
import { NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class OrdersController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'userId', value: req.authUser!.id },
			{ field: 'vendorId', value: req.authUser!.id },
			{ field: 'driverId', value: req.authUser!.id },
		]
		return await OrdersUseCases.get(query)
	}

	static async find(req: Request) {
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || ![order.userId, order.vendorId, order.driverId].includes(req.authUser!.id)) throw new NotFoundError()
		return order
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
		if (order.status !== OrderStatus.pendingPayment) throw new NotAuthorizedError('order cannot be paid for')

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
			amount: await FlutterwavePayment.convertAmount(transaction.amount, transaction.currency, Currencies.TRY),
		})

		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed },
		})

		return successful
	}
}
