import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { CustomersUseCases, TransactionsUseCases } from '../..'
import { TransactionFromModel } from '../../data/models/transactions'
import { TransactionEntity } from '../../domain/entities/transactions'
import { TransactionType } from '../../domain/types'

export const TransactionDbChangeCallbacks: DbChangeCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			after.managerId, after.driverId, `${after.id}/${after.managerId}`, `${after.id}/${after.driverId}`
		].map((c) => `trips/transactions/${c}`), after)

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
		await appInstance.listener.updated([
			after.managerId, after.driverId, `${after.id}/${after.managerId}`, `${after.id}/${after.driverId}`
		].map((c) => `trips/transactions/${c}`), after)

		const debtChanged = after.data.type === TransactionType.trip && before.data.type === TransactionType.trip && after.data.debt !== before.data.debt
		if (debtChanged) await CustomersUseCases.updateDebt({
			driverId: after.driverId,
			name: after.data.customerName,
			count: after.data.debt - before.data.debt
		})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			before.managerId, before.driverId, `${before.id}/${before.managerId}`, `${before.id}/${before.driverId}`
		].map((c) => `trips/transactions/${c}`), before)

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