import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ILikeRepository } from '../../domain/irepositories/likes'
import { Interaction } from '../../domain/types'
import { LikeMapper } from '../mappers/likes'
import { LikeToModel } from '../models/likes'
import { Like } from '../mongooseModels/likes'

export class LikeRepository implements ILikeRepository {
	private static instance: LikeRepository
	private mapper: LikeMapper

	private constructor() {
		this.mapper = new LikeMapper()
	}

	static getInstance() {
		if (!LikeRepository.instance) LikeRepository.instance = new LikeRepository()
		return LikeRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Like, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async like(data: LikeToModel) {
		let like = await Like.findOne({ 'user.id': data.user.id, entity: data.entity })
		if (!like) like = new Like(data)
		else if (like.value === data.value) {
			await like.deleteOne()
			return null
		} else like.value = data.value
		await like.save()
		return this.mapper.mapFrom(like)
	}

	async find(id: string) {
		const like = await Like.findById(id)
		return this.mapper.mapFrom(like)
	}

	async deleteEntityLikes({ type, id }: Interaction) {
		const likes = await Like.deleteMany({ 'entity.type': type, 'entity.id': id })
		return !!likes.acknowledged
	}

	async updateUserBio(user: LikeToModel['user']) {
		const likes = await Like.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!likes.acknowledged
	}
}
