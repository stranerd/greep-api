import { InteractionEntities, verifyInteractionAndGetUserId, ViewsUseCases } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class ViewsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await ViewsUseCases.get(query)
	}

	static async find(req: Request) {
		return await ViewsUseCases.find(req.params.id)
	}

	static async create(req: Request) {
		const { entity } = validate(
			{
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const userId = await verifyInteractionAndGetUserId(entity.type, entity.id, 'views')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ViewsUseCases.create({
			entity: { ...entity, userId },
			user: user.getEmbedded(),
		})
	}

	static async delete(req: Request) {
		const isDeleted = await ViewsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
