import { isAdmin, isAuthenticated } from '@application/middlewares'
import { OrdersUseCases } from '@modules/marketplace'
import { ChatMetaEntity, ChatMetasUseCases, ChatSupportType, ChatType } from '@modules/messaging'
import { mergeWithUsers } from '@modules/users'
import {
	ApiDef,
	BadRequestError,
	Conditions,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	QueryResults,
	Router,
	Schema,
	validate,
} from 'equipped'

const router = new Router({ path: '/support', groups: ['Support'], middlewares: [isAuthenticated] })

router.get<MessagingSupportGetRouteDef>({ path: '/', key: 'messaging-support-get' })(async (req) => {
	const query = req.query
	query.auth = [
		{ field: 'data.type', value: ChatType.support },
		{ field: 'members.1', condition: Conditions.exists, value: false },
	]
	const res = await ChatMetasUseCases.get(query)
	return {
		...res,
		results: await mergeWithUsers(res.results, (e) => e.members),
	}
})

router.get<MessagingSupportFindRouteDef>({ path: '/:id', key: 'messaging-support-find' })(async (req) => {
	const chatMeta = await ChatMetasUseCases.find(req.params.id)
	if (!chatMeta || chatMeta.data.type !== ChatType.support || chatMeta.members.length !== 1) throw new NotFoundError()
	return (await mergeWithUsers([chatMeta], (e) => e.members))[0]
})

router.post<MessagingSupportCreateRouteDef>({ path: '/', key: 'messaging-support-create' })(async (req) => {
	const { data } = validate(
		{
			data: Schema.discriminate((d) => d.type, {
				[ChatSupportType.orders]: Schema.object({
					type: Schema.is(ChatSupportType.orders as const),
					orderId: Schema.string().min(1),
				}),
			}),
		},
		req.body,
	)

	const userId = req.authUser!.id
	if (data.type === ChatSupportType.orders) {
		const order = await OrdersUseCases.find(data.orderId)
		if (!order || order.userId !== userId) throw new BadRequestError('order not found')
	}

	const chatMeta = await ChatMetasUseCases.create({
		members: [userId],
		data: { sub: data, type: ChatType.support },
	})
	return (await mergeWithUsers([chatMeta], (e) => e.members))[0]
})

router.post<MessagingSupportAssignRouteDef>({ path: '/:id/assign', key: 'messaging-support-assign', middlewares: [isAdmin] })(
	async (req) => {
		const chatMeta = await ChatMetasUseCases.assignSupport({ id: req.params.id, userId: req.authUser!.id })
		if (!chatMeta) throw new NotAuthorizedError()
		return (await mergeWithUsers([chatMeta], (e) => e.members))[0]
	},
)

export default router

type MessagingSupportGetRouteDef = ApiDef<{
	key: 'messaging-support-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ChatMetaEntity>
}>

type MessagingSupportFindRouteDef = ApiDef<{
	key: 'messaging-support-find'
	method: 'get'
	params: { id: string }
	response: ChatMetaEntity
}>

type MessagingSupportCreateRouteDef = ApiDef<{
	key: 'messaging-support-create'
	method: 'post'
	body: { data: { type: ChatSupportType; orderId: string } }
	response: ChatMetaEntity
}>

type MessagingSupportAssignRouteDef = ApiDef<{
	key: 'messaging-support-assign'
	method: 'post'
	params: { id: string }
	response: ChatMetaEntity
}>
