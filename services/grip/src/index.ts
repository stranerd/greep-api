import { getNewServerInstance } from '@stranerd/api-commons'
import { appId, appInstance, port } from '@utils/environment'
import { subscribers } from '@utils/events'

const app = getNewServerInstance([], {
	onConnect: async () => {
	},
	onDisconnect: async () => {
	}
})
export const getSocketEmitter = () => app.socketEmitter

const start = async () => {
	await appInstance.startDbConnection()
	await Promise.all(
		Object.values(subscribers)
			.map(async (subscriber) => {
				await subscriber.subscribe()
			})
	)
	await app.start(port)
	await appInstance.logger.success(`${appId} api has started listening on port`, port)
}

start().then()