import { ReferralEntity, ReferralFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const ReferralDbChangeCallbacks: DbChangeCallbacks<ReferralFromModel, ReferralEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`users/referrals/${after.userId}`,
			`users/referrals/${after.id}/${after.userId}`,
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`users/referrals/${after.userId}`,
			`users/referrals/${after.id}/${after.userId}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`users/referrals/${before.userId}`,
			`users/referrals/${before.id}/${before.userId}`,
		], before)
	}
}