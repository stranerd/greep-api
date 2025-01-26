import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { PromotionFromModel } from '../../data/models/promotions'
import { PromotionEntity } from '../../domain/entities/promotions'
import { publishers } from '@utils/events'

export const PromotionDbChangeCallbacks: DbChangeCallbacks<PromotionFromModel, PromotionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/promotions', `marketplace/promotions/${after.id}`], after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['marketplace/promotions', `marketplace/promotions/${before.id}`], { before, after })
		if (changes.banner && before.banner) await publishers.DELETEFILE.publish(before.banner)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/promotions', `marketplace/promotions/${before.id}`], before)
		await publishers.DELETEFILE.publish(before.banner)
	},
}
