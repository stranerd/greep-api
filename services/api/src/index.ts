import { getNewServerInstance, OnJoinFn } from '@stranerd/api-commons'
import { appId, appInstance, port } from '@utils/environment'
import { subscribers } from '@utils/events'
import { routes } from '@application/routes'
import { UsersUseCases } from '@modules/users'
import { startJobs } from '@utils/jobs'

const app = getNewServerInstance(routes, {
	onConnect: async (userId, socketId) => {
		await UsersUseCases.updateUserStatus({ userId, socketId, add: true })
	},
	onDisconnect: async (userId, socketId) => {
		await UsersUseCases.updateUserStatus({ userId, socketId, add: false })
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

	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	getSocketEmitter().register('users/customers', isMine)
	getSocketEmitter().register('users/transactions', isMine)
	getSocketEmitter().register('users/users', isOpen)

	await UsersUseCases.resetAllUsersStatus()

	await app.start(port)
	await appInstance.logger.success(`${appId} service has started listening on port`, port)
	await startJobs()
}

start().then()