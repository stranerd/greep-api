import { BaseMapper } from 'equipped'
import { MediaEntity } from '../../domain/entities/media'
import { MediaFromModel, MediaToModel } from '../models/media'

export class MediaMapper extends BaseMapper<MediaFromModel, MediaToModel, MediaEntity> {
	mapFrom(param: MediaFromModel | null) {
		if (!param) return null
		return new MediaEntity({
			id: param._id.toString(),
			file: param.file,
			entity: param.entity,
			user: param.user,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt,
		})
	}

	mapTo(param: MediaEntity) {
		return {
			file: param.file,
			entity: param.entity,
			user: param.user,
		}
	}
}
