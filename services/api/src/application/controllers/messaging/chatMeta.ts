import { ChatMetasUseCases } from '@modules/messaging'
import { mergeChatMetasWithUserBios } from '@modules/messaging/utils'
import { NotAuthorizedError, NotFoundError, QueryParams, Request } from 'equipped'

export class ChatMetaController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'members', value: req.authUser!.id }]
		const res = await ChatMetasUseCases.get(query)
		res.results = await mergeChatMetasWithUserBios(res.results)
		return res
	}

	static async find(req: Request) {
		const chatMeta = await ChatMetasUseCases.find(req.params.id)
		if (!chatMeta || !chatMeta.members.includes(req.authUser!.id)) throw new NotFoundError()
		return (await mergeChatMetasWithUserBios([chatMeta]))[0]
	}

	static async delete(req: Request) {
		const deleted = await ChatMetasUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}
}
