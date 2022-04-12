import { getNewServerInstance } from '@stranerd/api-commons'
import { appId, appInstance, port } from '@utils/environment'
import { EventTypes, publishers, subscribers } from '@utils/events'
import { DelayedEvent } from '@utils/types/bull'
import { routes } from '@application/routes'

const app = getNewServerInstance(routes, {
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
	await appInstance.job.startProcessingQueues<DelayedEvent>({
		onDelayed: async (data) => {
			await publishers[EventTypes.TASKSDELAYED].publish(data)
		},
		onCron: async (type) => {
			await publishers[EventTypes.TASKSCRON].publish({ type })
		}
	})
}

start().then()