import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { ReportFromModel } from '../../data/models/reports'
import { ReportEntity } from '../../domain/entities/reports'

export const ReportDbChangeCallbacks: DbChangeCallbacks<ReportFromModel, ReportEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created(['interactions/reports', `interactions/reports/${after.id}`], after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated(['interactions/reports', `interactions/reports/${after.id}`], after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted(['interactions/reports', `interactions/reports/${before.id}`], before)
	},
}
