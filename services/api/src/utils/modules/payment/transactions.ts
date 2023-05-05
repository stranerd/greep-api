import {
	Currencies,
	MethodsUseCases,
	TransactionEntity,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { FlutterwavePayment } from '@utils/modules/payment/flutterwave'
import { Conditions } from 'equipped'

export const fulfillTransaction = async (transaction: TransactionEntity) => {
	if (transaction.data.type === TransactionType.NewCard) {
		const method = await FlutterwavePayment.saveCard(transaction.userId, transaction.id)
		if (!method) return
		await MethodsUseCases.create(method)
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await FlutterwavePayment.convertAmount(transaction.amount, transaction.currency, Currencies.TRY)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	}
}

export const retryTransactions = async (timeInMs: number) => {
	const { results: fulfilledTransactions } = await TransactionsUseCases.get({
		where: [{ field: 'status', value: TransactionStatus.fulfilled },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }],
		all: true
	})
	await Promise.all(fulfilledTransactions.map(fulfillTransaction))

	const { results: initializedTransactions } = await TransactionsUseCases.get({
		where: [{ field: 'status', value: TransactionStatus.initialized },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }],
		all: true
	})
	await TransactionsUseCases.delete(initializedTransactions.map((t) => t.id))
}