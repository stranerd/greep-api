import { OrdersUseCases } from '@modules/marketplace'
import { NotFoundError, QueryKeys, QueryParams, Request } from 'equipped'

export class OrdersController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		query.authType = QueryKeys.and
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await OrdersUseCases.get(query)
	}

	static async find(req: Request) {
		const order = await OrdersUseCases.find(req.params.id)
		if (!order || order.userId !== req.authUser!.id) throw new NotFoundError()
		return order
	}
}
