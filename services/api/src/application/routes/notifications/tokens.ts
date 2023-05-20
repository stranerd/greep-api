import { isAuthenticated } from '@application/middlewares'
import { TokensUseCases } from '@modules/notifications'
import { groupRoutes, makeController, Schema, StatusCodes, validate } from 'equipped'

export const tokenRoutes = groupRoutes('/tokens', [
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