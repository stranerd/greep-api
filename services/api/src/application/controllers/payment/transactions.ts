import { Currencies, fulfillTransaction, TransactionStatus, TransactionsUseCases, TransactionType, WalletsUseCases } from '@modules/payment'
import { flutterwaveConfig } from '@utils/environment'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate, ValidationError } from 'equipped'

export class TransactionsController {
	static async getSecrets (_: Request) {
		return { publicKey: flutterwaveConfig.publicKey }
	}

	static async find (req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) throw new NotFoundError()
		return transaction
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await TransactionsUseCases.get(query)
	}

	static async fund (req: Request) {
		const authUser = req.authUser!

		const wallet = await WalletsUseCases.get(authUser.id)
		if (!wallet.pin) throw new ValidationError([{ field: 'pin', messages: ['pin is not set'] }])

		const { amount } = validate({
			pin: Schema.string().min(4).max(4)
				.eq(wallet.pin, (val, comp) => val === comp, 'invalid pin'),
			amount: Schema.number().gt(0)
		}, req.body)

		return await TransactionsUseCases.create({
			title: 'Fund wallet',
			currency: Currencies.TRY,
			amount,
			userId: authUser.id, email: authUser.email,
			status: TransactionStatus.initialized,
			data: { type: TransactionType.FundWallet }
		})
	}

	static async fulfill (req: Request) {
		const transaction = await TransactionsUseCases.find(req.params.id)
		if (!transaction || transaction.userId !== req.authUser!.id) throw new NotAuthorizedError()
		const successful = await fulfillTransaction(transaction)
		if (!successful) throw new BadRequestError('transaction unsuccessful')
		return successful
	}
}