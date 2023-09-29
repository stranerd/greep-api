import { ChatMetasUseCases } from '@modules/messaging'
import { Conditions, QueryParams, Request } from 'equipped'

export class ChatMetaController {
	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'members', condition: Conditions.in, value: req.authUser!.id }]
		return await ChatMetasUseCases.get(query)
	}

	static async find (req: Request) {
		const chatMeta = await ChatMetasUseCases.find(req.params.id)
		if (!chatMeta || !chatMeta.members.includes(req.authUser!.id)) return null
		return chatMeta
	}
}