import { Currencies, FlutterwavePayment, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { getNGNToLiraRate } from '@modules/payment/utils/exchange'
import { flutterwaveConfig } from '@utils/environment'
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

	static async fund (req: Request) {
		const authUser = req.authUser!

		const { amount } = validate({
			amount: Schema.number().gt(0)
		}, req.body)

		return await TransactionsUseCases.create({
			title: 'Fund wallet',
			currency: Currencies.NGN,
			amount,
			userId: authUser.id, email: authUser.email,
			status: TransactionStatus.initialized,
			data: { type: TransactionType.FundWallet, exchangeRate: await getNGNToLiraRate() }
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