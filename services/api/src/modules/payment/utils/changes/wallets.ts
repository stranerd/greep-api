import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { WalletFromModel } from '../../data/models/wallets'
import { WalletEntity } from '../../domain/entities/wallets'

export const WalletDbChangeCallbacks: DbChangeCallbacks<WalletFromModel, WalletEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`payment/wallets/${after.userId}`,
			`payment/wallets/${after.id}/${after.userId}`,
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`payment/wallets/${after.userId}`,
			`payment/wallets/${after.id}/${after.userId}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`payment/wallets/${before.userId}`,
			`payment/wallets/${before.id}/${before.userId}`,
		], before)
	}
}