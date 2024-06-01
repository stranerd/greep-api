import { isAuthenticated } from '@application/middlewares'
import { TokensUseCases } from '@modules/notifications'
import { UsersUseCases } from '@modules/users'
import { ApiDef, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/tokens', groups: ['Tokens'], middlewares: [isAuthenticated] })

router.post<NotificationsTokensEnableRouteDef>({ path: '/enable', key: 'notifications-tokens-get' })(async (req) => {
	const { enable } = validate({ enable: Schema.boolean() }, req.body)
	const user = await UsersUseCases.updateSettings({ userId: req.authUser!.id, settings: { notifications: enable } })
	return !!user
})

router.post<NotificationsTokensSubscribeRouteDef>({ path: '/devices/subscribe', key: 'notifications-tokens-subscribe' })(async (req) => {
	const { token } = validate({ token: Schema.string().min(1) }, req.body)
	const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: true })
	return !!res
})

router.post<NotificationsTokensUnsubscribeRouteDef>({ path: '/devices/unsubscribe', key: 'notifications-tokens-unsubscribe' })(
	async (req) => {
		const { token } = validate({ token: Schema.string().min(1) }, req.body)
		const res = await TokensUseCases.update({ userId: req.authUser!.id, tokens: [token], add: false })
		return !!res
	},
)

export default router

type NotificationsTokensEnableRouteDef = ApiDef<{
	key: 'notifications-tokens-get'
	method: 'post'
	body: { enable: boolean }
	response: boolean
}>

type NotificationsTokensSubscribeRouteDef = ApiDef<{
	key: 'notifications-tokens-subscribe'
	method: 'post'
	body: { token: string }
	response: boolean
}>

type NotificationsTokensUnsubscribeRouteDef = ApiDef<{
	key: 'notifications-tokens-unsubscribe'
	method: 'post'
	body: { token: string }
	response: boolean
}>
