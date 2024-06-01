import { isAuthenticated } from '@application/middlewares'
import { TokensUseCases } from '@modules/notifications'
import { UsersUseCases } from '@modules/users'
import { groupRoutes, Schema, validate } from 'equipped'

export const tokenRoutes = groupRoutes({ path: '/tokens', groups: ['Tokens'], middlewares: [isAuthenticated] }, [
	{
		path: '/enable',
		method: 'post',
		handler: async (req) => {
			const { enable } = validate({ enable: Schema.boolean() }, req.body)
			const user = await UsersUseCases.updateSettings({ userId: req.authUser!.id, settings: { notifications: enable } })
			return !!user
		},
	},
	{
		path: '/devices/subscribe',
		method: 'post',
		handler: async (req) => {
			const { token } = validate(
				{
					token: Schema.string().min(1),
				},
				req.body,
			)
			const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: true })
			return !!res
		},
	},
	{
		path: '/devices/unsubscribe',
		method: 'post',
		handler: async (req) => {
			const { token } = validate(
				{
					token: Schema.string().min(1),
				},
				req.body,
			)
			const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: false })
			return !!res
		},
	},
])
