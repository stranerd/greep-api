import { TagsUseCases, TagTypes } from '@modules/interactions'
import { NotAuthorizedError, QueryParams, Request, Schema, validate } from 'equipped'

export class TagController {
	private static schema = () => ({
		title: Schema.string().min(1),
	})

	static async find(req: Request) {
		return await TagsUseCases.find(req.params.id)
	}

	static async get(req: Request) {
		const query = req.query as QueryParams
		return await TagsUseCases.get(query)
	}

	static async update(req: Request) {
		const data = validate(this.schema(), req.body)

		const updatedTag = await TagsUseCases.update({ id: req.params.id, data })
		if (updatedTag) return updatedTag
		throw new NotAuthorizedError()
	}

	static async create(req: Request) {
		const data = validate(
			{
				...this.schema(),
				type: Schema.in(Object.values(TagTypes)),
			},
			req.body,
		)

		// if (data.parent !== null) throw new BadRequestError('no tag type can have children')

		return await TagsUseCases.add({ ...data, parent: null })
	}

	static async delete(req: Request) {
		const isDeleted = await TagsUseCases.delete({ id: req.params.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}
