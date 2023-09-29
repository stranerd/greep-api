import { routes } from '@application/routes'
import { UsersUseCases } from '@modules/users'
import { appInstance, isDev, port } from '@utils/environment'
import { subscribers } from '@utils/events'
import { startJobs } from '@utils/jobs'
import { OnJoinFn } from 'equipped'
import { initializeApp } from 'firebase-admin/app'

const start = async () => {
	if (!isDev) initializeApp()
	await appInstance.startConnections()
	await Promise.all(
		Object.values(subscribers)
			.map(async (subscriber) => {
				await subscriber.subscribe()
			})
	)

	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	appInstance.listener
		.register('users/customers', isMine)
		.register('users/transactions', isMine)
		.register('users/trips', isMine)
		.register('users/users', isOpen)
		.register('messaging/chats', isMine)
		.register('messaging/chatMetas', isMine)

	await UsersUseCases.resetAllUsersStatus()

	appInstance.listener.callers = {
		onConnect: async (userId, socketId) => {
			await UsersUseCases.updateUserStatus({ userId, socketId, add: true })
		},
		onDisconnect: async (userId, socketId) => {
			await UsersUseCases.updateUserStatus({ userId, socketId, add: false })
		}
	}

	const app = appInstance.server
	app.routes = routes
	await app.start(port)
	await startJobs()
}

start().then()