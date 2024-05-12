import { OrdersUseCases } from '@modules/marketplace'
import { ChatMetasUseCases, ChatSupportType, ChatType } from '@modules/messaging'
import { mergeWithUsers } from '@modules/users'
import { BadRequestError, Conditions, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class SupportController {
	static async create(req: Request) {
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
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		query.auth = [
			{ field: 'data.type', value: ChatType.support },
			{ field: 'members.1', condition: Conditions.exists, value: false },
		]
		const res = await ChatMetasUseCases.get(query)
		res.results = await mergeWithUsers(res.results, (e) => e.members)
		return res
	}

	static async find(req: Request) {
		const chatMeta = await ChatMetasUseCases.find(req.params.id)
		if (!chatMeta || chatMeta.data.type !== ChatType.support || chatMeta.members.length !== 1) throw new NotFoundError()
		return (await mergeWithUsers([chatMeta], (e) => e.members))[0]
	}

	static async assign(req: Request) {
		const chatMeta = await ChatMetasUseCases.assignSupport({ id: req.params.id, userId: req.authUser!.id })
		if (!chatMeta) throw new NotAuthorizedError()
		return (await mergeWithUsers([chatMeta], (e) => e.members))[0]
	}
}
