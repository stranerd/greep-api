import { CategoriesUseCases } from '@modules/marketplace'
import { NotAuthorizedError, NotFoundError, QueryParams, Request, Schema, validate } from 'equipped'

export class CategoriesController {
	private static schema = () => ({
		title: Schema.string().min(1),
	})

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await CategoriesUseCases.get(query)
	}

	static async find(req: Request) {
		const category = await CategoriesUseCases.find(req.params.id)
		if (!category) throw new NotFoundError()
		return category
	}

	static async create(req: Request) {
		const data = validate(this.schema(), req.body)
		return await CategoriesUseCases.create(data)
	}

	static async update(req: Request) {
		const data = validate(this.schema(), req.body)
		const updated = await CategoriesUseCases.update({ id: req.params.id, data })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete(req: Request) {
		const deleted = await CategoriesUseCases.delete(req.params.id)
		if (deleted) return deleted
		throw new NotAuthorizedError()
	}
}
