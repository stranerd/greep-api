import { BaseMapper } from 'equipped'
import { CommentEntity } from '../../domain/entities/comments'
import { CommentFromModel, CommentToModel } from '../models/comments'

export class CommentMapper extends BaseMapper<CommentFromModel, CommentToModel, CommentEntity> {
	mapFrom(param: CommentFromModel | null) {
		if (!param) return null
		return new CommentEntity({
			id: param._id.toString(),
			body: param.body,
			entity: param.entity,
			user: param.user,
			meta: param.meta,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: CommentEntity) {
		return {
			body: param.body,
			entity: param.entity,
			user: param.user,
		}
	}
}
