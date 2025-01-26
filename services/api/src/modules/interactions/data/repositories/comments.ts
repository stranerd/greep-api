import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { ICommentRepository } from '../../domain/irepositories/comments'
import { CommentMeta, Interaction } from '../../domain/types'
import { CommentMapper } from '../mappers/comments'
import { CommentToModel } from '../models/comments'
import { Comment } from '../mongooseModels/comments'

export class CommentRepository implements ICommentRepository {
	private static instance: CommentRepository
	private mapper: CommentMapper

	private constructor() {
		this.mapper = new CommentMapper()
	}

	static getInstance() {
		if (!CommentRepository.instance) CommentRepository.instance = new CommentRepository()
		return CommentRepository.instance
	}

	async get(query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Comment, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!),
		}
	}

	async add(data: CommentToModel) {
		const comment = await new Comment(data).save()
		return this.mapper.mapFrom(comment)!
	}

	async find(id: string) {
		const comment = await Comment.findById(id)
		return this.mapper.mapFrom(comment)
	}

	async update(id: string, userId: string, data: Partial<CommentToModel>) {
		const comment = await Comment.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data }, { new: true })
		return this.mapper.mapFrom(comment)
	}

	async delete(id: string, userId: string) {
		const comment = await Comment.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!comment
	}

	async deleteEntityComments({ type, id }: Interaction) {
		const comments = await Comment.deleteMany({ 'entity.type': type, 'entity.id': id })
		return !!comments.acknowledged
	}

	async updateMeta(commentId: string, property: CommentMeta, value: 1 | -1) {
		await Comment.findByIdAndUpdate(commentId, {
			$inc: { [`meta.${property}`]: value, [`meta.${CommentMeta.total}`]: value },
		})
	}

	async updateUserBio(user: CommentToModel['user']) {
		const comments = await Comment.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!comments.acknowledged
	}
}
