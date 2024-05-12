import { OrdersUseCases } from '@modules/marketplace'
import { ChatMetasUseCases, ChatSupportType, ChatType } from '@modules/messaging'
import { mergeChatMetasWithUserBios } from '@modules/messaging/utils'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class ChatMetaController {
	static async createSupport (req: Request) {
		const { data } = validate(
			{
				data: Schema.discriminate((d) => d.type, {
					[ChatSupportType.orders]: Schema.object({
						type: Schema.is(ChatSupportType.orders as const),
						orderId: Schema.string().min(1),
					})
				}),
			},
			req.body
		)

		const userId = req.authUser!.id
		if (data.type === ChatSupportType.orders) {
			const order = await OrdersUseCases.find(data.orderId)
			if (!order || order.userId !== userId) throw new BadRequestError('order not found')
		}

		const chatMeta = await ChatMetasUseCases.create({
			members: [userId],
			data: { sub: data, type: ChatType.support }
		})
		return (await mergeChatMetasWithUserBios([chatMeta]))[0]
	}

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
