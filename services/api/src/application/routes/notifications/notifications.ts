import { isAuthenticated } from '@application/middlewares'
import { NotificationEntity, NotificationsUseCases } from '@modules/notifications'
import { ApiDef, NotFoundError, QueryParams, QueryResults, Router, Schema, validate } from 'equipped'

const router = new Router({ path: '/notifications', groups: ['Notifications'], middlewares: [isAuthenticated] })

router.get<NotificationsGetRouteDef>({ path: '/', key: 'notifications-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'userId', value: req.authUser!.id }]
	return await NotificationsUseCases.get(query)
})

router.get<NotificationsFindRouteDef>({ path: '/:id', key: 'notifications-find' })(async (req) => {
	const notification = await NotificationsUseCases.find(req.params.id)
	if (!notification || notification.userId !== req.authUser!.id) throw new NotFoundError()
	return notification
})

router.put<NotificationsMarkAllSeenRouteDef>({ path: '/seen', key: 'notifications-mark-all-seen' })(async (req) => {
	const { seen } = validate({ seen: Schema.boolean() }, req.body)

	await NotificationsUseCases.markSeen({
		userId: req.authUser!.id,
		seen,
	})

	return true
})

router.put<NotificationsMarkSeenRouteDef>({ path: '/:id/seen', key: 'notifications-mark-seen' })(async (req) => {
	const { seen } = validate({ seen: Schema.boolean() }, req.body)

	await NotificationsUseCases.markSeen({
		ids: [req.params.id],
		userId: req.authUser!.id,
		seen,
	})

	return true
})

export default router

type NotificationsGetRouteDef = ApiDef<{
	key: 'notifications-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<NotificationEntity>
}>

type NotificationsFindRouteDef = ApiDef<{
	key: 'notifications-find'
	method: 'get'
	params: { id: string }
	response: NotificationEntity
}>

type NotificationsMarkAllSeenRouteDef = ApiDef<{
	key: 'notifications-mark-all-seen'
	method: 'put'
	response: boolean
}>

type NotificationsMarkSeenRouteDef = ApiDef<{
	key: 'notifications-mark-seen'
	method: 'put'
	params: { id: string }
	response: boolean
}>
