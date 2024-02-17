import { InteractionEntities, ReportsUseCases, verifyInteractionAndGetUserId } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class ReportController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await ReportsUseCases.get(query)
	}

	static async find(req: Request) {
		const report = await ReportsUseCases.find(req.params.id)
		if (!report) throw new NotFoundError()
		return report
	}

	static async delete(req: Request) {
		return await ReportsUseCases.delete(req.params.id)
	}

	static async create(req: Request) {
		const { entity, message } = validate(
			{
				message: Schema.string().min(1),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const userId = await verifyInteractionAndGetUserId(entity.type, entity.id, 'reports')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ReportsUseCases.create({
			message,
			entity: { ...entity, userId },
			user: user.getEmbedded(),
		})
	}
}
