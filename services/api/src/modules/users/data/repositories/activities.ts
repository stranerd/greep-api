import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IActivityRepository } from '../../domain/i-repositories/activities'
import { ActivityMapper } from '../mappers/activities'
import { ActivityToModel } from '../models/activities'
import { Activity } from '../mongooseModels/activities'

export class ActivityRepository implements IActivityRepository {
	private static instance: ActivityRepository
	private mapper = new ActivityMapper()

	static getInstance (): ActivityRepository {
		if (!ActivityRepository.instance) ActivityRepository.instance = new ActivityRepository()
		return ActivityRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Activity, query)
		return {
			...data,
			results: data.results.map((n) => this.mapper.mapFrom(n)!)
		}
	}

	async find (id: string) {
		const activity = await Activity.findById(id)
		return this.mapper.mapFrom(activity)
	}

	async create (data: ActivityToModel) {
		const activity = await new Activity(data).save()
		return this.mapper.mapFrom(activity)!
	}
}