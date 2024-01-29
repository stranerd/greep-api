import { BaseMapper } from 'equipped'
import { ChatEntity } from '../../domain/entities/chat'
import { ChatFromModel, ChatToModel } from '../models/chat'

export class ChatMapper extends BaseMapper<ChatFromModel, ChatToModel, ChatEntity> {
	mapFrom(model: ChatFromModel | null) {
		if (!model) return null
		const { _id, from, to, body, links, media, data, readAt, createdAt, updatedAt } = model
		return new ChatEntity({
			id: _id.toString(),
			from,
			to,
			body,
			links,
			media,
			data,
			createdAt,
			updatedAt,
			readAt,
		})
	}

	mapTo(entity: ChatEntity) {
		return {
			body: entity.body,
			links: entity.links,
			from: entity.from,
			to: entity.to,
			media: entity.media,
			data: entity.data,
		}
	}
}
