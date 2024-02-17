import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IMediaRepository } from '../../domain/irepositories/media'
import { Interaction } from '../../domain/types'
import { MediaMapper } from '../mappers/media'
import { MediaToModel } from '../models/media'
import { Media } from '../mongooseModels/media'

export class MediaRepository implements IMediaRepository {
	private static instance: MediaRepository
	private mapper: MediaMapper

	private constructor() {
		this.mapper = new MediaMapper()
	}

	static getInstance() {
		if (!MediaRepository.instance) MediaRepository.instance = new MediaRepository()
		return MediaRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Media, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: MediaToModel) {
		const media = await new Media(data).save()
		return this.mapper.mapFrom(media)!
	}

	async find(id: string) {
		const media = await Media.findById(id)
		return this.mapper.mapFrom(media)
	}

	async update(id: string, userId: string, data: Partial<MediaToModel>) {
		const media = await Media.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(media)
	}

	async delete(id: string, userId: string) {
		const media = await Media.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!media
	}

	async deleteEntityMedias({ type, id }: Interaction) {
		const medias = await Media.deleteMany({ 'entity.type': type, 'entity.id': id })
		return !!medias.acknowledged
	}

	async updateUserBio(user: MediaToModel['user']) {
		const medias = await Media.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!medias.acknowledged
	}
}
