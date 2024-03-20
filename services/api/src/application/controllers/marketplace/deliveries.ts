import { DeliveriesUseCases } from '@modules/marketplace'
import { NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class DeliveriesController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'userId', value: req.authUser!.id },
			{ field: 'driverId', value: req.authUser!.id },
		]
		return await DeliveriesUseCases.get(query)
	}

	static async find(req: Request) {
		const delivery = await DeliveriesUseCases.find(req.params.id)
		if (!delivery || !(delivery.userId === req.authUser!.id || delivery.driverId === req.authUser!.id)) throw new NotFoundError()
		return delivery
	}

	static async generateToken(req: Request) {
		return await DeliveriesUseCases.generateToken({
			id: req.params.id,
			userId: req.authUser!.id,
		})
	}

	static async complete(req: Request) {
		const { token } = validate(
			{
				token: Schema.string().min(1),
			},
			req.body,
		)

		const updated = await DeliveriesUseCases.complete({
			id: req.params.id,
			userId: req.authUser!.id,
			token,
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}
}
