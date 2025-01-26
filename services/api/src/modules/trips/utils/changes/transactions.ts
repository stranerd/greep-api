import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { TransactionsUseCases } from '../..'
import { TransactionFromModel } from '../../data/models/transactions'
import { TransactionEntity } from '../../domain/entities/transactions'
import { TransactionType } from '../../domain/types'

export const TransactionDbChangeCallbacks: DbChangeCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.driverId, `${after.id}/${after.driverId}`].map((c) => `trips/transactions/${c}`),
			after,
		)

		if (after.data.type === TransactionType.balance)
			await TransactionsUseCases.updateTripDebt({
				id: after.data.parentId,
				driverId: after.driverId,
				amount: after.amount,
			})

		if (after.data.type === TransactionType.trip && after.data.customerId) {
			await UsersUseCases.updateTrip({
				driverId: after.driverId,
				userId: after.data.customerId,
				count: 1,
			})
			if (after.data.debt !== 0)
				await UsersUseCases.updateDebt({
					driverId: after.driverId,
					userId: after.data.customerId,
					count: after.data.debt,
				})
		}
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[after.driverId, `${after.id}/${after.driverId}`].map((c) => `trips/transactions/${c}`),
			{ after, before },
		)

		if (
			after.data.type === TransactionType.trip &&
			after.data.customerId &&
			before.data.type === TransactionType.trip &&
			after.data.debt !== before.data.debt
		)
			await UsersUseCases.updateDebt({
				driverId: after.driverId,
				userId: after.data.customerId,
				count: after.data.debt - before.data.debt,
			})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.driverId, `${before.id}/${before.driverId}`].map((c) => `trips/transactions/${c}`),
			before,
		)

		if (before.data.type === TransactionType.trip && before.data.customerId) {
			await UsersUseCases.updateTrip({
				driverId: before.driverId,
				userId: before.data.customerId,
				count: -1,
			})
			if (before.data.debt !== 0)
				await UsersUseCases.updateDebt({
					driverId: before.driverId,
					userId: before.data.customerId,
					count: -before.data.debt,
				})
		}

		if (before.data.type === TransactionType.balance)
			await TransactionsUseCases.updateTripDebt({
				id: before.data.parentId,
				driverId: before.driverId,
				amount: -before.amount,
			})
	},
}
