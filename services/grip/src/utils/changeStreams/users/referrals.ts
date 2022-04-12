import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { ReferralEntity, ReferralFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'

export const ReferralChangeStreamCallbacks: ChangeStreamCallbacks<ReferralFromModel, ReferralEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated(`users/referrals/${after.userId}`, after)
		await getSocketEmitter().emitCreated(`users/referrals/${after.id}/${after.userId}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated(`users/referrals/${after.userId}`, after)
		await getSocketEmitter().emitUpdated(`users/referrals/${after.id}/${after.userId}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted(`users/referrals/${before.userId}`, before)
		await getSocketEmitter().emitDeleted(`users/referrals/${before.id}/${before.userId}`, before)
	}
}