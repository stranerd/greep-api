import { QueryParams } from 'equipped'
import { MediaToModel } from '../../data/models/media'
import { IMediaRepository } from '../irepositories/media'
import { Interaction } from '../types'

export class MediaUseCase {
	repository: IMediaRepository

	constructor(repo: IMediaRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async create(data: MediaToModel) {
		return await this.repository.add(data)
	}

	async update(input: { id: string; userId: string; data: Partial<MediaToModel> }) {
		return await this.repository.update(input.id, input.userId, input.data)
	}

	async delete(input: { id: string; userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async deleteEntityMedias(entity: Interaction) {
		return await this.repository.deleteEntityMedias(entity)
	}

	async updateUserBio(user: MediaToModel['user']) {
		return await this.repository.updateUserBio(user)
	}

	async reorder(input: { entity: MediaToModel['entity']; ids: string[] }) {
		return await this.repository.reorder(input.entity, input.ids)
	}
}
