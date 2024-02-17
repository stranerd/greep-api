import { BaseMapper } from 'equipped'
import { TagEntity } from '../../domain/entities/tags'
import { TagFromModel, TagToModel } from '../models/tags'

export class TagMapper extends BaseMapper<TagFromModel, TagToModel, TagEntity> {
	mapFrom(model: TagFromModel | null) {
		if (!model) return null
		const { _id, type, title, parent, meta, createdAt, updatedAt } = model
		return new TagEntity({
			id: _id.toString(),
			type,
			title,
			parent,
			meta,
			createdAt,
			updatedAt,
		})
	}

	mapTo(entity: TagEntity) {
		return {
			type: entity.type,
			title: entity.title,
			parent: entity.parent,
		}
	}
}
