import { isAuthenticated } from '@application/middlewares'
import { ChatEntity, ChatMetasUseCases, ChatType, ChatsUseCases } from '@modules/messaging'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { ApiDef, BadRequestError, NotFoundError, QueryParams, QueryResults, Router, Schema, Validation, validate } from 'equipped'

const router = new Router({ path: '/chats', groups: ['Chats'], middlewares: [isAuthenticated] })

router.get<MessagingChatsGetRouteDef>({ path: '/', key: 'messaging-chats-get' })(async (req) => {
	const query = req.query
	query.auth = [{ field: 'data.members', value: req.authUser!.id }]
	return await ChatsUseCases.get(query)
})

router.get<MessagingChatsFindRouteDef>({ path: '/:id', key: 'messaging-chats-find' })(async (req) => {
	const chat = await ChatsUseCases.find(req.params.id)
	if (!chat || !chat.data.members.includes(req.authUser!.id)) throw new NotFoundError()
	return chat
})

router.post<MessagingChatsCreateRouteDef>({ path: '/', key: 'messaging-chats-create' })(async (req) => {
	const {
		body,
		media: mediaFile,
		to,
		type,
	} = validate(
		{
			body: Schema.string(),
			to: Schema.string()
				.min(1)
				.ne(req.authUser!.id, (val, comp) => val === comp, 'cannot send message to yourself'),
			media: Schema.file().nullable(),
			type: Schema.in(Object.values(ChatType)).default(ChatType.personal),
		},
		{
			...req.body,
			media: req.files.media?.[0] ?? null,
		},
	)

	const media = mediaFile ? await StorageUseCases.upload('messaging/chats', mediaFile) : null
	const from = req.authUser!.id
	let members: string[] = []

	if (type === ChatType.personal) {
		const user = await UsersUseCases.find(to)
		if (!user || user.isDeleted()) throw new BadRequestError('user not found')
		members = [from, to]
	}

	if (type === ChatType.support) {
		const chatMeta = await ChatMetasUseCases.find(to)
		if (!chatMeta || chatMeta.data.type !== ChatType.support || !chatMeta.members.includes(from))
			throw new BadRequestError('support chat not found')
		members = chatMeta.members
	}

	return await ChatsUseCases.add({
		body,
		media,
		from,
		to,
		links: Validation.extractUrls(body),
		data: { type, members },
	})
})

router.put<MessagingChatsReadRouteDef>({ path: '/read', key: 'messaging-chats-read' })(async (req) => {
	const data = validate({ to: Schema.string() }, req.body)

	const authUserId = req.authUser!.id
	return await ChatsUseCases.markRead({
		from: authUserId,
		to: data.to,
	})
})

export default router

type MessagingChatsGetRouteDef = ApiDef<{
	key: 'messaging-chats-get'
	method: 'get'
	query: QueryParams
	response: QueryResults<ChatEntity>
}>

type MessagingChatsFindRouteDef = ApiDef<{
	key: 'messaging-chats-find'
	method: 'get'
	params: { id: string }
	response: ChatEntity
}>

type MessagingChatsCreateRouteDef = ApiDef<{
	key: 'messaging-chats-create'
	method: 'post'
	body: { body: string; to: string; type: ChatType }
	files: { media?: false }
	response: ChatEntity
}>

type MessagingChatsReadRouteDef = ApiDef<{
	key: 'messaging-chats-read'
	method: 'put'
	body: { to: string }
	response: boolean
}>
