import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { PromotionFromModel } from '../../data/models/promotions'
import { PromotionEntity } from '../../domain/entities/promotions'

export const PromotionDbChangeCallbacks: DbChangeCallbacks<PromotionFromModel, PromotionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/promotions', `marketplace/promotions/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/promotions', `marketplace/promotions/${before.id}`], before)
	},
}
