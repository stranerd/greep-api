import { ProductsUseCases } from '@modules/marketplace'
import { NotAuthorizedError, NotFoundError, QueryParams, Request } from 'equipped'

export class ProductsController {
	static async get(req: Request) {
		const query = req.query as QueryParams
		return await ProductsUseCases.get(query)
	}

	static async find(req: Request) {
		const product = await ProductsUseCases.find(req.params.id)
		if (!product) throw new NotFoundError()
		return product
	}

	static async delete(req: Request) {
		const deleted = await ProductsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}
}
