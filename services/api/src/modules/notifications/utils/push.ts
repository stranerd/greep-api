import { appInstance } from '@utils/environment'
import { PushNotification } from '@utils/types/push'
import { messaging } from 'firebase-admin'
import { TokensUseCases } from '../'
import { UsersUseCases } from '@modules/users'
import { Validation } from 'equipped'
import { OrderEntity } from '@modules/marketplace'

export const sendPushNotification = async (notification: PushNotification) => {
	try {
		const { userIds, data, title, body } = notification
		await Promise.all(
			userIds.map(async (userId) => {
				const user = await UsersUseCases.find(userId)
				if (!user || user.isDeleted() || !user.account.settings.notifications) return
				const userTokens = await TokensUseCases.find({ userId })
				const chunks = Validation.chunkArray(userTokens.tokens, 500)
				const invalidTokens = [] as string[]

				await Promise.all(
					chunks.map(async (tokens) => {
						const res = await messaging().sendEachForMulticast({
							tokens,
							notification: { title, body },
							data: { value: JSON.stringify(data) },
						})
						res.responses.forEach((resp, index) => {
							if (resp.success) return
							const err = resp.error!
							const invalids = [
								'messaging/invalid-argument',
								'messaging/invalid-registration-token',
								'messaging/registration-token-not-registered',
							]
							if (invalids.includes(err.code)) invalidTokens.push(tokens[index])
							else appInstance.logger.error(err)
						})
					}),
				)

				if (invalidTokens.length)
					await TokensUseCases.update({
						userId,
						tokens: invalidTokens,
						add: false,
					})
			}),
		)
	} catch (err) {
		await appInstance.logger.error(err)
	}
}

export const sendFetchRequest = async (data: OrderEntity, driverId: string) => {
	try {
		await fetch('https://notifyneworder-vlghotkn6q-uc.a.run.app', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: data.id,
				fromName: data.from.location,
				toName: data.to.location,
			}),
		})
	} catch (err) {
		await appInstance.logger.error(`Error sending fetch request for driver ${driverId}:`, err)
	}
}
