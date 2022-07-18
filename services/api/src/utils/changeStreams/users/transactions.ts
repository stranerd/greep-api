import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import {
	CustomersUseCases,
	TransactionEntity,
	TransactionFromModel,
	TransactionsUseCases,
	TransactionType
} from '@modules/users'
import { getSocketEmitter } from '@index'

export const TransactionChangeStreamCallbacks: ChangeStreamCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`users/transactions/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.managerId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.id}/${after.managerId}`, after)

		if (after.data.type === TransactionType.balance) await TransactionsUseCases.updateTripDebt({
			id: after.data.parentId,
			driverId: after.driverId,
			amount: after.amount
		})

		if (after.data.type === TransactionType.trip) {
			await CustomersUseCases.updateTrip({
				driverId: after.driverId,
				name: after.data.customerName,
				count: 1
			})
			if (after.data.debt !== 0) await CustomersUseCases.updateDebt({
				driverId: after.driverId,
				name: after.data.customerName,
				count: after.data.debt
			})
		}
	},
	updated: async ({ after, before }) => {
		await getSocketEmitter().emitUpdated(`users/transactions/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/transactions/${after.managerId}`, after)
		await getSocketEmitter().emitUpdated(`users/transactions/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/transactions/${after.id}/${after.managerId}`, after)

		const debtChanged = after.data.type === TransactionType.trip && before.data.type === TransactionType.trip && after.data.debt !== before.data.debt
		if (debtChanged) await CustomersUseCases.updateDebt({
			driverId: after.driverId,
			name: after.data.customerName,
			count: after.data.debt - before.data.debt
		})
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`users/transactions/${before.driverId}`, before)
		await getSocketEmitter().emitDeleted(`users/transactions/${before.managerId}`, before)
		await getSocketEmitter().emitDeleted(`users/transactions/${before.id}/${before.driverId}`, before)
		await getSocketEmitter().emitDeleted(`users/transactions/${before.id}/${before.managerId}`, before)

		if (before.data.type === TransactionType.trip) {
			await CustomersUseCases.updateTrip({
				driverId: before.driverId,
				name: before.data.customerName,
				count: -1
			})
			if (before.data.debt !== 0) await CustomersUseCases.updateDebt({
				driverId: before.driverId,
				name: before.data.customerName,
				count: -before.data.debt
			})
		}

		if (before.data.type === TransactionType.balance) await TransactionsUseCases.updateTripDebt({
			id: before.data.parentId,
			driverId: before.driverId,
			amount: -before.amount
		})
	}
}