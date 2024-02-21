import { InteractionEntities, ReviewsUseCases, verifyInteractionAndGetUserId } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class ReviewsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await ReviewsUseCases.get(query)
	}

	static async find(req: Request) {
		const review = await ReviewsUseCases.find(req.params.id)
		if (!review) throw new NotFoundError()
		return review
	}

	static async add(req: Request) {
		const { rating, message, entity } = validate(
			{
				rating: Schema.number().round(0).gte(0).lte(5),
				message: Schema.string(),
				entity: Schema.object({
					id: Schema.string().min(1),
					type: Schema.in(Object.values(InteractionEntities)),
				}),
			},
			req.body,
		)

		const userId = await verifyInteractionAndGetUserId(entity.type, entity.id, 'reviews')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user || user.isDeleted()) throw new BadRequestError('profile not found')

		return await ReviewsUseCases.add({
			rating,
			message,
			entity: { ...entity, userId },
			user: user.getEmbedded(),
		})
	}
}
