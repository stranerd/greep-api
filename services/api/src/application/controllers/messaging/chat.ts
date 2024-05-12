import { ChatMetasUseCases, ChatType, ChatsUseCases } from '@modules/messaging'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotFoundError, QueryParams, Request, Schema, Validation, validate } from 'equipped'

export class ChatController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'data.members', value: req.authUser!.id }]
		return await ChatsUseCases.get(query)
	}

	static async find(req: Request) {
		const chat = await ChatsUseCases.find(req.params.id)
		if (!chat || !chat.data.members.includes(req.authUser!.id)) throw new NotFoundError()
		return chat
	}

	static async add(req: Request) {
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

		if (type === ChatType.personal) {
			const user = await UsersUseCases.find(to)
			if (!user || user.isDeleted()) throw new BadRequestError('user not found')
		}

		if (type === ChatType.support) {
			const chatMeta = await ChatMetasUseCases.find(to)
			if (!chatMeta || chatMeta.data.type !== ChatType.support || !chatMeta.members.includes(from))
				throw new BadRequestError('support chat not found')
		}

		return await ChatsUseCases.add({
			body, media, from, to,
			links: Validation.extractUrls(body),
			data: type === ChatType.personal ? { type, members: [from, to] } : { type, members: [from] },
		})
	}

	static async markRead(req: Request) {
		const data = validate(
			{
				to: Schema.string(),
			},
			req.body,
		)

		const authUserId = req.authUser!.id
		return await ChatsUseCases.markRead({
			from: authUserId,
			to: data.to,
		})
	}
}
