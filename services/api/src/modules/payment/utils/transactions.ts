import { Conditions } from 'equipped'
import { FlutterwavePayment, TransactionsUseCases, WalletsUseCases } from '../'
import { TransactionEntity } from '../domain/entities/transactions'
import { Currencies, TransactionStatus, TransactionType } from '../domain/types'
import { NotificationType, sendNotification } from '@modules/notifications'

export const settleTransaction = async (transaction: TransactionEntity) => {
	if (transaction.data.type === TransactionType.FundWallet) {
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await FlutterwavePayment.convertAmount(transaction.amount, transaction.currency, Currencies.TRY)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
		await sendNotification([transaction.userId], {
			title: 'Wallet Funded',
			body: `Your wallet has been funded with ${transaction.amount} ${transaction.currency}`,
			data: { type: NotificationType.WalletFundSuccessful, amount: transaction.amount, currency: transaction.currency }
		})
	}
}

export const fulfillTransaction = async (transaction: TransactionEntity) => {
	const successful = await FlutterwavePayment.verify(transaction.id, transaction.amount, transaction.currency)
	if (!successful) return false
	const txn = await TransactionsUseCases.update({
		id: transaction.id,
		data: { status: TransactionStatus.fulfilled }
	})
	return !!txn
}

export const retryTransactions = async (timeInMs: number) => {
	const { results: fulfilledTransactions } = await TransactionsUseCases.get({
		where: [
			{ field: 'status', value: TransactionStatus.fulfilled },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	await Promise.all(fulfilledTransactions.map(settleTransaction))

	const { results: initializedTransactions } = await TransactionsUseCases.get({
		where: [
			{ field: 'status', value: TransactionStatus.initialized },
			{ field: 'createdAt', condition: Conditions.lt, value: Date.now() - timeInMs }
		],
		all: true
	})
	await Promise.all(initializedTransactions.map(fulfillTransaction))
}