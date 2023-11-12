import { ChatMetasUseCases } from '@modules/messaging'
import { NotAuthorizedError, NotFoundError, QueryParams, Request } from 'equipped'

export class ChatMetaController {
	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'members', value: req.authUser!.id }]
		return await ChatMetasUseCases.get(query)
	}

	static async find (req: Request) {
		const chatMeta = await ChatMetasUseCases.find(req.params.id)
		if (!chatMeta || !chatMeta.members.includes(req.authUser!.id)) throw new NotFoundError()
		return chatMeta
	}

	static async delete (req: Request) {
		const deleted = await ChatMetasUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}
}