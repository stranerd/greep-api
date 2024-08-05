import { TagsUseCases } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'
import { ProductFromModel } from '../../data/models/products'
import { ProductEntity } from '../../domain/entities/products'

export const ProductDbChangeCallbacks: DbChangeCallbacks<ProductFromModel, ProductEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/products', `marketplace/products/${after.id}`], after)
		await Promise.all([
			UsersUseCases.updateVendorTags({
				id: after.user.id,
				tagIds: after.tagIds,
				add: true,
			}),
			TagsUseCases.updateMeta({ ids: after.tagIds, property: after.getTagMetaType(), value: 1 }),
		])
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated(['marketplace/products', `marketplace/products/${after.id}`], { after, before })
		const removedTags = before.tagIds.filter((t) => !after.tagIds.includes(t))
		const addedTags = after.tagIds.filter((t) => !before.tagIds.includes(t))
		await Promise.all([
			changes.banner && before.banner && publishers.DELETEFILE.publish(before.banner),
			removedTags.length &&
				UsersUseCases.updateVendorTags({
					id: after.user.id,
					tagIds: removedTags,
					add: false,
				}),
			addedTags.length &&
				UsersUseCases.updateVendorTags({
					id: after.user.id,
					tagIds: addedTags,
					add: true,
				}),
		])
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/products', `marketplace/products/${before.id}`], before)
		await Promise.all([
			UsersUseCases.updateVendorTags({
				id: before.user.id,
				tagIds: before.tagIds,
				add: false,
			}),
			TagsUseCases.updateMeta({ ids: before.tagIds, property: before.getTagMetaType(), value: -1 }),
			publishers.DELETEFILE.publish(before.banner),
		])
	},
}
