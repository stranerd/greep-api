import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'
import { EmailErrorFromModel } from '../../data/models/emailErrors'
import { EmailErrorEntity } from '../../domain/entities/emailErrors'

export const EmailErrorDbChangeCallbacks: DbChangeCallbacks<EmailErrorFromModel, EmailErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	},
}
