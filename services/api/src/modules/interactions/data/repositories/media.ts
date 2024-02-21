import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IMediaRepository } from '../../domain/irepositories/media'
import { Interaction } from '../../domain/types'
import { MediaMapper } from '../mappers/media'
import { MediaFromModel, MediaToModel } from '../models/media'
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
		let res = null as MediaFromModel | null
		await Media.collection.conn.transaction(async (session) => {
			const highestOrderedMedia = await Media.findOne({ entity: data.entity }, {}, { session }).sort({ order: 'desc' })
			const order = (highestOrderedMedia?.order ?? -1) + 1
			const media = await new Media({ ...data, order }).save()
			return (res = media)
		})
		return this.mapper.mapFrom(res)!
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

	async reorder(entity: MediaToModel['entity'], ids: string[]) {
		const res: MediaFromModel[] = []
		await Media.collection.conn.transaction(async (session) => {
			const media = await Media.find({ entity }, {}, { session })
			const allMedia = media.map((m) => this.mapper.mapFrom(m)!)
			const map = Object.fromEntries(allMedia.map((m) => [m.id, m]))
			const mapped = ids.map((id) => map[id]).filter(Boolean)
			const unOrdered = allMedia.filter((m) => ids.includes(m.id))
			const ordered = [...mapped, ...unOrdered]
			const bulk = Media.collection.initializeUnorderedBulkOp()
			for (const media of ordered) {
				media.order = ordered.indexOf(media)
				bulk.find({ _id: media.id }).updateOne({
					$set: {
						order: media.order,
					},
				})
			}
			await bulk.execute({ session })
			const updated = await Media.find({ entity }, {}, { new: true })
			res.splice(0, res.length, ...updated)
		})
		return res.map((m) => this.mapper.mapFrom(m)!)
	}
}
