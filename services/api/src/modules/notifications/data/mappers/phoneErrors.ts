import { BaseMapper } from 'equipped'
import { PhoneErrorEntity } from '../../domain/entities/phoneErrors'
import { PhoneErrorFromModel, PhoneErrorToModel } from '../models/phoneErrors'

export class PhoneErrorMapper extends BaseMapper<PhoneErrorFromModel, PhoneErrorToModel, PhoneErrorEntity> {
	mapFrom(model: PhoneErrorFromModel | null) {
		if (!model) return null
		const { _id, content, to, from, error, createdAt, updatedAt } = model
		return new PhoneErrorEntity({
			id: _id.toString(),
			content,
			to,
			from,
			error,
			createdAt,
			updatedAt,
		})
	}

	mapTo(entity: PhoneErrorEntity) {
		return {
			content: entity.content,
			to: entity.to,
			from: entity.from,
			error: entity.error,
		}
	}
}
