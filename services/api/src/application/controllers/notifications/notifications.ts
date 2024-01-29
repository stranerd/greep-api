import { NotificationsUseCases } from '@modules/notifications'
import { NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class NotificationsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await NotificationsUseCases.get(query)
	}

	static async find(req: Request) {
		const notification = await NotificationsUseCases.find(req.params.id)
		if (!notification || notification.userId !== req.authUser!.id) throw new NotFoundError()
		return notification
	}

	static async markSeen(req: Request) {
		const data = validate(
			{
				seen: Schema.boolean(),
			},
			req.body,
		)

		await NotificationsUseCases.markSeen({
			ids: [req.params.id],
			userId: req.authUser!.id,
			seen: !!data.seen,
		})

		return true
	}

	static async markAllSeen(req: Request) {
		const { seen } = validate(
			{
				seen: Schema.boolean(),
			},
			req.body,
		)

		await NotificationsUseCases.markSeen({
			userId: req.authUser!.id,
			seen,
		})

		return true
	}
}
