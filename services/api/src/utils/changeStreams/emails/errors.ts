import { ChangeStreamCallbacks } from 'equipped'
import { ErrorEntity, ErrorFromModel } from '@modules/emails'
import { appInstance } from '@utils/environment'

export const ErrorChangeStreamCallbacks: ChangeStreamCallbacks<ErrorFromModel, ErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}