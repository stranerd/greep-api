import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { LikeFromModel } from '../../data/models/likes'
import { LikeEntity } from '../../domain/entities/likes'
import { InteractionEntities } from '@modules/interactions'
import { ProductsUseCases } from '@modules/marketplace'

export const LikeDbChangeCallbacks: DbChangeCallbacks<LikeFromModel, LikeEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/likes', `interactions/likes/${after.id}`], after)

		if (after.entity.type === InteractionEntities.products)
			await ProductsUseCases.updateLikes({ id: after.entity.id, userId: after.user.id, like: after.value })
	},
	updated: async ({ after, changes }) => {
		await appInstance.listener.updated(['interactions/likes', `interactions/likes/${after.id}`], after)

		if (changes.value) {
			if (after.entity.type === InteractionEntities.products)
				await ProductsUseCases.updateLikes({ id: after.entity.id, userId: after.user.id, like: after.value })
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/likes', `interactions/likes/${before.id}`], before)

		if (before.entity.type === InteractionEntities.products)
			await ProductsUseCases.updateLikes({ id: before.entity.id, userId: before.user.id, like: before.value })
	},
}
