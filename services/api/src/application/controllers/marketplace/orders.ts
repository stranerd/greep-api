import { OrdersUseCases } from '@modules/marketplace'
import { NotAuthorizedError, NotFoundError, QueryKeys, QueryParams, Request, Schema, validate } from 'equipped'

export class OrdersController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.or
		query.auth = [
			{ field: 'userId', value: req.authUser!.id },
			{ field: 'vendorId', value: req.authUser!.id },
		]
		return await OrdersUseCases.get(query)
	}

	static async find(req: Request) {
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || !(order.userId === req.authUser!.id || order.vendorId === req.authUser!.id)) throw new NotFoundError()
		return order
	}

	static async accept(req: Request) {
		const data = validate(
			{
				accepted: Schema.boolean(),
				message: Schema.string(),
			},
			req.body,
		)

		const accepted = await OrdersUseCases.accept({
			...data,
			id: req.params.id,
			userId: req.authUser!.id,
		})

		if (accepted) return accepted
		throw new NotAuthorizedError()
	}
}
