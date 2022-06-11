import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { CustomersUseCases, TransactionEntity, TransactionFromModel, TransactionType } from '@modules/users'
import { getSocketEmitter } from '@index'

export const TransactionChangeStreamCallbacks: ChangeStreamCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`users/transactions/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.managerId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.id}/${after.managerId}`, after)

		if (after.data.type === TransactionType.balance) {
			const customer = await CustomersUseCases.find({ id: after.data.customerId, userId: after.driverId })
			if (customer) await CustomersUseCases.updateDebt({
				driverId: after.driverId,
				name: customer.name,
				count: -after.amount
			})
		}

		if (after.data.type === TransactionType.trip) {
			await CustomersUseCases.updateTrip({
				driverId: after.driverId,
				name: after.data.customerName,
				count: 1
			})
			if (after.getDebt() > 0) await CustomersUseCases.updateDebt({
				driverId: after.driverId,
				name: after.data.customerName,
				count: after.getDebt()
			})
		}
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`users/transactions/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/transactions/${after.managerId}`, after)
		await getSocketEmitter().emitUpdated(`users/transactions/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitUpdated(`users/transactions/${after.id}/${after.managerId}`, after)
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
			if (before.getDebt() > 0) await CustomersUseCases.updateDebt({
				driverId: before.driverId,
				name: before.data.customerName,
				count: -before.getDebt()
			})
		}

		if (before.data.type === TransactionType.balance) {
			const customer = await CustomersUseCases.find({ id: before.data.customerId, userId: before.driverId })
			if (customer) await CustomersUseCases.updateDebt({
				driverId: before.driverId,
				name: customer.name,
				count: before.amount
			})
		}
	}
}