import { appInstance } from '@utils/environment'
import { PushNotification } from '@utils/types/push'

export const sendNotification = async (notification: PushNotification) => {
	try {
		await appInstance.logger.info('Unimplemented')
		await appInstance.logger.info(notification)
	} catch (err) {
		await appInstance.logger.error(err)
	}
}
