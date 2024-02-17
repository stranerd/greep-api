import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ProductFromModel } from '../../data/models/products'
import { ProductEntity } from '../../domain/entities/products'

export const ProductDbChangeCallbacks: DbChangeCallbacks<ProductFromModel, ProductEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['marketplace/products', `marketplace/products/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['marketplace/products', `marketplace/products/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['marketplace/products', `marketplace/products/${before.id}`], before)
	},
}
