import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { TransactionEntity, TransactionFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'

export const TransactionChangeStreamCallbacks: ChangeStreamCallbacks<TransactionFromModel, TransactionEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`users/transactions/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.managerId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.id}/${after.driverId}`, after)
		await getSocketEmitter().emitCreated(`users/transactions/${after.id}/${after.managerId}`, after)
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
	}
}