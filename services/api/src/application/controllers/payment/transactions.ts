import { Currencies, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { flutterwaveConfig } from '@utils/environment'
import { FlutterwavePayment } from '@utils/modules/payment/flutterwave'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class TransactionsController {
	static async getSecrets (_: Request) {
		return { publicKey: flutterwaveConfig.publicKey }
	}

	static async find (req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) return null
		return transaction
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TransactionsUseCases.get(query)
	}

	static async create (req: Request) {
		const isNewCardType = req.body.data?.type === TransactionType.NewCard
		const types = [TransactionType.NewCard]
		const authUser = req.authUser!

		const { data: { type } } = validate({
			data: Schema.object({
				type: Schema.any<TransactionType>().in(types)
			})
		}, req.body)

		const dynamics = { title: '', amount: 0 }

		if (isNewCardType) {
			dynamics.title = 'Test charge on new card'
			dynamics.amount = 10
		}

		return await TransactionsUseCases.create({
			...dynamics, currency: Currencies.TRY, userId: authUser.id, email: authUser.email,
			status: TransactionStatus.initialized, data: isNewCardType ? { type } : ({} as any)
		})
	}

	static async fulfill (req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) throw new NotAuthorizedError()
		const successful = await FlutterwavePayment.verify(transaction.id, transaction.amount, transaction.currency)
		if (!successful) throw new BadRequestError('transaction unsuccessful')
		const updatedTxn = await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.fulfilled }
		})
		return !!updatedTxn
	}
}