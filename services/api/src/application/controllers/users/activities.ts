import { ActivitiesUseCases } from '@modules/users'
import { NotFoundError, QueryParams, Request } from 'equipped'

export class ActivitiesController {
	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await ActivitiesUseCases.get(query)
	}

	static async find (req: Request) {
		const activity = await ActivitiesUseCases.find(req.params.id)
		if (!activity || activity.userId !== req.authUser!.id) throw new NotFoundError()
		return activity
	}
}