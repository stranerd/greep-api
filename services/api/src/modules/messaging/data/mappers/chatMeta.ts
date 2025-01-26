import { BaseMapper } from 'equipped'
import { ChatMetaEntity } from '../../domain/entities/chatMeta'
import { ChatMetaFromModel, ChatMetaToModel } from '../models/chatMeta'
import { ChatMapper } from './chat'

export class ChatMetaMapper extends BaseMapper<ChatMetaFromModel, ChatMetaToModel, ChatMetaEntity> {
	mapFrom(model: ChatMetaFromModel | null) {
		if (!model) return null
		const { _id, data, last, members, createdAt, updatedAt, readAt } = model
		const lastData = new ChatMapper().mapFrom(last)
		return new ChatMetaEntity({
			id: _id.toString(),
			last: lastData!,
			data,
			members,
			createdAt,
			updatedAt,
			readAt,
		})
	}

	mapTo(entity: ChatMetaEntity) {
		return {
			members: entity.members,
			data: entity.data,
		}
	}
}
