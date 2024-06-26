import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ActivitiesUseCases, UsersUseCases } from '../..'
import { ReferralFromModel } from '../../data/models/referrals'
import { ReferralEntity } from '../../domain/entities/referrals'
import { ActivityType, UserMeta } from '../../domain/types'

export const ReferralDbChangeCallbacks: DbChangeCallbacks<ReferralFromModel, ReferralEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([`users/referrals/${after.userId}`, `users/referrals/${after.id}/${after.userId}`], after)

		await Promise.all([
			ActivitiesUseCases.create({
				userId: after.userId,
				data: {
					type: ActivityType.referrals,
					referralId: after.id,
				},
			}),
			UsersUseCases.incrementMeta({
				id: after.userId,
				value: 1,
				property: UserMeta.referrals,
			}),
		])
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated([`users/referrals/${after.userId}`, `users/referrals/${after.id}/${after.userId}`], {
			after,
			before,
		})
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([`users/referrals/${before.userId}`, `users/referrals/${before.id}/${before.userId}`], before)

		await UsersUseCases.incrementMeta({
			id: before.userId,
			value: -1,
			property: UserMeta.referrals,
		})
	},
}
