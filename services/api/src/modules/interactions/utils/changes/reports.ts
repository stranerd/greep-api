import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ReportFromModel } from '../../data/models/reports'
import { ReportEntity } from '../../domain/entities/reports'

export const ReportDbChangeCallbacks: DbChangeCallbacks<ReportFromModel, ReportEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(
			[after.user.id, after.entity.userId]
				.map((uid) => [
					'interactions/reports',
					`interactions/reports/${uid}`,
					`interactions/reports/${after.id}`,
					`interactions/reports/${after.id}/${uid}`,
				])
				.flat(),
			after,
		)
	},
	updated: async ({ after, before }) => {
		await appInstance.listener.updated(
			[after.user.id, after.entity.userId]
				.map((uid) => [
					'interactions/reports',
					`interactions/reports/${uid}`,
					`interactions/reports/${after.id}`,
					`interactions/reports/${after.id}/${uid}`,
				])
				.flat(),
			{ after, before },
		)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(
			[before.user.id, before.entity.userId]
				.map((uid) => [
					'interactions/reports',
					`interactions/reports/${uid}`,
					`interactions/reports/${before.id}`,
					`interactions/reports/${before.id}/${uid}`,
				])
				.flat(),
			before,
		)
	},
}
