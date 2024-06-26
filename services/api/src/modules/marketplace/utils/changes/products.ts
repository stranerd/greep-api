import { TagsUseCases } from '@modules/interactions'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'
import { ProductFromModel } from '../../data/models/products'
import { ProductEntity } from '../../domain/entities/products'

export const ProductDbChangeCallbacks: DbChangeCallbacks<ProductFromModel, ProductEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/products', `marketplace/products/${after.id}`], after)
		await TagsUseCases.updateMeta({ ids: after.tagIds, property: after.getTagMetaType(), value: 1 })
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['marketplace/products', `marketplace/products/${after.id}`], { after, before })
		if (changes.banner && before.banner) await publishers.DELETEFILE.publish(before.banner)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/products', `marketplace/products/${before.id}`], before)
		await TagsUseCases.updateMeta({ ids: before.tagIds, property: before.getTagMetaType(), value: -1 })
		await publishers.DELETEFILE.publish(before.banner)
	},
}
