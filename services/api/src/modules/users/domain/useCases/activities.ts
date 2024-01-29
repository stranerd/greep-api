import { QueryParams } from 'equipped'
import { ActivityToModel } from '../../data/models/activities'
import { IActivityRepository } from '../i-repositories/activities'

export class ActivitiesUseCase {
	repository: IActivityRepository

	constructor(repo: IActivityRepository) {
		this.repository = repo
	}

	async create(input: ActivityToModel) {
		return await this.repository.create(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}
}
