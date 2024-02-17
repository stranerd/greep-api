import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { CategoryFromModel } from '../../data/models/categories'
import { CategoryEntity } from '../../domain/entities/categories'

export const CategoryDbChangeCallbacks: DbChangeCallbacks<CategoryFromModel, CategoryEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/categories', `marketplace/categories/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['marketplace/categories', `marketplace/categories/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/categories', `marketplace/categories/${before.id}`], before)
	},
}
