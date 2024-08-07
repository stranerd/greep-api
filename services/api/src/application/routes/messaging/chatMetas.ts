import { isAuthenticated } from '@application/middlewares'
import { ChatMetaEntity, ChatMetasUseCases } from '@modules/messaging'
import { mergeWithUsers } from '@modules/users'
import { ApiDef, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router } from 'equipped'

const router = new Router({ path: '/chatMetas', groups: ['Chat metas'], middlewares: [isAuthenticated] })

router.get<MessagingChatMetasGetRouteDef>({ path: '/', key: 'messaging-chat-metas-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'members', value: req.authUser!.id }]
	const res = await ChatMetasUseCases.get(query)
	return {
		...res,
		results: await mergeWithUsers(res.results, (e) => e.members),
	}
})

router.get<MessagingChatMetasFindRouteDef>({ path: '/:id', key: 'messaging-chat-metas-find' })(async (req) => {
	const chatMeta = await ChatMetasUseCases.find(req.params.id)
	if (!chatMeta || !chatMeta.members.includes(req.authUser!.id)) throw new NotFoundError()
	return (await mergeWithUsers([chatMeta], (e) => e.members))[0]
})

router.delete<MessagingChatMetasDeleteRouteDef>({ path: '/:id', key: 'messaging-chat-metas-delete' })(async (req) => {
	const deleted = await ChatMetasUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
	if (deleted) return deleted
	throw new NotAuthorizedError()
})

export default router

type MessagingChatMetasGetRouteDef = ApiDef<{
	key: 'messaging-chat-metas-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ChatMetaEntity>
}>

type MessagingChatMetasFindRouteDef = ApiDef<{
	key: 'messaging-chat-metas-find'
	method: 'get'
	params: { id: string }
	response: ChatMetaEntity
}>

type MessagingChatMetasDeleteRouteDef = ApiDef<{
	key: 'messaging-chat-metas-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
