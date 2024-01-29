import { PaymentType, TransactionsUseCases, TransactionType } from '@modules/trips'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class TransactionsController {
	static async getTransactions(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'driverId', value: req.authUser!.id }]
		return await TransactionsUseCases.get(query)
	}

	static async getTransactionsAdmin(req: Request) {
		const query = req.query as QueryParams
		return await TransactionsUseCases.get(query)
	}

	static async findTransaction(req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.driverId !== req.authUser!.id) throw new NotFoundError()
		return transaction
	}

	static async findTransactionAdmin(req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction) throw new NotFoundError()
		return transaction
	}

	static async createTransaction(req: Request) {
		const isBalance = req.body.data?.type === TransactionType.balance

		const data = validate(
			{
				amount: Schema.number().gt(isBalance ? Number.NEGATIVE_INFINITY : 0),
				description: Schema.string(),
				recordedAt: Schema.time().asStamp(),
				data: Schema.or([
					Schema.object({
						type: Schema.is(TransactionType.expense as const),
						name: Schema.string().min(1),
					}),
					Schema.object({
						type: Schema.is(TransactionType.balance as const),
						parentId: Schema.string().min(1),
					}),
					Schema.object({
						type: Schema.is(TransactionType.trip as const),
						customerId: Schema.string().min(1),
						paidAmount: Schema.number(),
						paymentType: Schema.any<PaymentType>().in(Object.values(PaymentType)).default(PaymentType.cash),
					}),
				]),
			},
			req.body,
		)

		const driverId = req.authUser!.id
		const driver = await UsersUseCases.find(driverId)
		if (!driver) throw new BadRequestError('profile not found')

		if (data.data.type === TransactionType.balance) {
			const parent = await TransactionsUseCases.find(data.data.parentId)
			if (!parent) throw new BadRequestError('parent transaction not found')
			if (parent.driverId !== driverId) throw new BadRequestError('parent transaction isn\'t yours')
			if (parent.data.type !== TransactionType.trip) throw new BadRequestError('parent transaction is not a trip')
			if (parent.data.debt === 0) throw new BadRequestError('parent transaction is settled already')
			if (Math.abs(parent.data.debt) < Math.abs(data.amount)) throw new BadRequestError('amount is greater than the debt to settle')
		}

		if (data.data.type === TransactionType.trip) {
			const customer = await UsersUseCases.find(data.data.customerId)
			if (!customer || customer.isDeleted()) throw new BadRequestError('customer not found')
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
	}

	static async deleteTransaction(req: Request) {
		const isDeleted = await TransactionsUseCases.delete({ id: req.params.id, driverId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
