import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ActivityFromModel } from '../../data/models/activities'
import { ActivityEntity } from '../../domain/entities/activities'

export const ActivityDbChangeCallbacks: DbChangeCallbacks<ActivityFromModel, ActivityEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created([
			`users/activities/${after.userId}`,
			`users/activities/${after.id}/${after.userId}`,
		], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated([
			`users/activities/${after.userId}`,
			`users/activities/${after.id}/${after.userId}`,
		], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted([
			`users/activities/${before.userId}`,
			`users/activities/${before.id}/${before.userId}`,
		], before)
	}
}