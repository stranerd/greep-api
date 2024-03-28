import { OrderPayment, OrderStatus, OrdersUseCases } from '@modules/marketplace'
import { TransactionStatus, TransactionType, TransactionsUseCases, WalletsUseCases } from '@modules/payment'
import { Conditions, NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class OrdersController {
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
}
