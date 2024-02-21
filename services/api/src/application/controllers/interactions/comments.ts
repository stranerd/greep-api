import { CommentsUseCases, InteractionEntities, verifyInteractionAndGetUserId } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class CommentsController {
	private static schema = () => ({
		body: Schema.string().min(1),
	})

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await CommentsUseCases.get(query)
	}

	static async find(req: Request) {
		const comment = await CommentsUseCases.find(req.params.id)
		if (!comment) throw new NotFoundError()
		return comment
	}

	static async create(req: Request) {
		const { body, entity } = validate(
			{
				...this.schema(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const userId = await verifyInteractionAndGetUserId(entity.type, entity.id, 'comments')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await CommentsUseCases.create({
			body,
			entity: { ...entity, userId },
			user: user.getEmbedded(),
		})
	}

	static async update(req: Request) {
		const { body } = validate(this.schema(), req.body)

		const updated = await CommentsUseCases.update({
			id: req.params.id,
			userId: req.authUser!.id,
			data: { body },
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const isDeleted = await CommentsUseCases.delete({
			id: req.params.id,
			userId: req.authUser!.id,
		})
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
