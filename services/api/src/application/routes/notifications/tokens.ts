import { isAuthenticated } from '@application/middlewares'
import { TokensUseCases } from '@modules/notifications'
import { UsersUseCases } from '@modules/users'
import { groupRoutes, makeController, Schema, StatusCodes, validate } from 'equipped'

export const tokenRoutes = groupRoutes('/tokens', [
	{
		path: '/enable',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				const { enable } = validate({ enable: Schema.boolean() }, req.body)
				const user = await UsersUseCases.updateSettings({ userId: req.authUser!.id, settings: { notifications: enable } })
				return {
					status: StatusCodes.Ok,
					result: !!user
				}
			})
		]
	},
	{
		path: '/devices/subscribe',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				const { token } = validate({
					token: Schema.string().min(1)
				}, req.body)
				const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: true })
				return {
					status: StatusCodes.Ok,
					result: !!res
				}
			})
		]
	}, {
		path: '/devices/unsubscribe',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				const { token } = validate({
					token: Schema.string().min(1)
				}, req.body)
				const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: false })
				return {
					status: StatusCodes.Ok,
					result: !!res
				}
			})
		]
	}
])