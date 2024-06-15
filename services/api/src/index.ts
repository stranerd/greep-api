import { router } from '@application/routes'
import { UsersUseCases } from '@modules/users'
import { appInstance, isDev, port } from '@utils/environment'
import { subscribers } from '@utils/events'
import { startJobs } from '@utils/jobs'
import { AuthRole, OnJoinFn } from 'equipped'
import { initializeApp } from 'firebase-admin/app'

import schemas from '@application/schema.json'

const start = async () => {
	if (!isDev) initializeApp()
	await appInstance.startConnections()
	await Promise.all(
		Object.values(subscribers).map(async (subscriber) => {
			await subscriber.subscribe()
		}),
	)

	// const isAdmin: OnJoinFn = async ({ channel, user }) => (user?.roles?.[AuthRole.isAdmin] ? channel : null)
	const isAdminOrMine: OnJoinFn = async ({ channel, user }) =>
		!user ? null : user.roles?.[AuthRole.isAdmin] ? channel : `${channel}/${user.id}`
	const isMine: OnJoinFn = async ({ channel, user }) => (user ? `${channel}/${user.id}` : null)
	const isOpen: OnJoinFn = async ({ channel }) => channel

	appInstance.listener
		.register('interactions/comments', isOpen)
		.register('interactions/likes', isMine)
		.register('interactions/media', isOpen)
		.register('interactions/reports', isAdminOrMine)
		.register('interactions/reviews', isOpen)
		.register('interactions/tags', isOpen)
		.register('interactions/views', isMine)

		.register('marketplace/carts', isMine)
		.register('marketplace/cartLinks', isOpen)
		.register('marketplace/orders', isMine)
		.register('marketplace/products', isOpen)

		.register('messaging/chats', isMine)
		.register('messaging/chatMetas', isMine)

		.register('notifications/notifications', isMine)

		.register('payment/transactions', isMine)
		.register('payment/wallets', isMine)
		.register('payment/requests', isMine)
		.register('payment/withdrawals', isMine)

		.register('trips/transactions', isMine)
		.register('trips/trips', isMine)

		.register('users/activities', isMine)
		.register('users/referrals', isMine)
		.register('users/users', isOpen)

	await UsersUseCases.resetAllUsersStatus()

	appInstance.listener.callers = {
		onConnect: async (userId, socketId) => {
			await UsersUseCases.updateUserStatus({ userId, socketId, add: true })
		},
		onDisconnect: async (userId, socketId) => {
			await UsersUseCases.updateUserStatus({ userId, socketId, add: false })
		},
	}

	const app = appInstance.server
	app.addSchema(schemas)
	app.addRouter(router)
	await app.start(port)
	await startJobs()
}

start().then()
