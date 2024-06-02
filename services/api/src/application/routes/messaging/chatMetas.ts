import { isAuthenticated } from '@application/middlewares'
import { ApiDef, NotAuthorizedError, NotFoundError, QueryParams, QueryResults, Router } from 'equipped'
import { ChatMetaEntity, ChatMetasUseCases } from '@modules/messaging'
import { EmbeddedUser, mergeWithUsers } from '@modules/users'

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

type ChatMeta = ChatMetaEntity & { users: EmbeddedUser[] }

type MessagingChatMetasGetRouteDef = ApiDef<{
	key: 'messaging-chat-metas-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ChatMeta>
}>

type MessagingChatMetasFindRouteDef = ApiDef<{
	key: 'messaging-chat-metas-find'
	method: 'get'
	params: { id: string }
	response: ChatMeta
}>

type MessagingChatMetasDeleteRouteDef = ApiDef<{
	key: 'messaging-chat-metas-delete'
	method: 'delete'
	params: { id: string }
	response: boolean
}>
