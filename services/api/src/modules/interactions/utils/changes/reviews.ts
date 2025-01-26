import { InteractionEntities } from '@modules/interactions'
import { ProductsUseCases } from '@modules/marketplace'
import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ReviewFromModel } from '../../data/models/reviews'
import { ReviewEntity } from '../../domain/entities/reviews'

export const ReviewDbChangeCallbacks: DbChangeCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/reviews', `interactions/reviews/${after.id}`], after)

		if (after.entity.type === InteractionEntities.products)
			await ProductsUseCases.updateRatings({ id: after.entity.id, ratings: after.rating, add: true })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['interactions/reviews', `interactions/reviews/${after.id}`], { after, before })

		if (changes.rating) {
			if (after.entity.type === InteractionEntities.products)
				await ProductsUseCases.updateRatings({ id: after.entity.id, ratings: before.rating, add: false }).then(() =>
					ProductsUseCases.updateRatings({ id: after.entity.id, ratings: after.rating, add: true }),
				)
			if (after.entity.type === InteractionEntities.vendors)
				await UsersUseCases.updateRatings({ id: after.entity.id, ratings: before.rating, add: false }).then(() =>
					UsersUseCases.updateRatings({ id: after.entity.id, ratings: after.rating, add: true }),
				)
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/reviews', `interactions/reviews/${before.id}`], before)

		if (before.entity.type === InteractionEntities.products)
			await ProductsUseCases.updateRatings({ id: before.entity.id, ratings: before.rating, add: false })
		if (before.entity.type === InteractionEntities.vendors)
			await UsersUseCases.updateRatings({ id: before.entity.id, ratings: before.rating, add: false })
	},
}
