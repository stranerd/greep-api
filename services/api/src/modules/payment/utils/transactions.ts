import { Conditions } from 'equipped'
import { TransactionsUseCases } from '../'
import { TransactionEntity } from '../domain/entities/transactions'
import { TransactionStatus } from '../domain/types'

export const fulfillTransaction = async (_: TransactionEntity) => {

	/* await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		}) */
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