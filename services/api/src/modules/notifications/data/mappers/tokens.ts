import { BaseMapper } from 'equipped'
import { TokenEntity } from '../../domain/entities/tokens'
import { TokenFromModel, TokenToModel } from '../models/tokens'

export class TokenMapper extends BaseMapper<TokenFromModel, TokenToModel, TokenEntity> {
	mapFrom (model: TokenFromModel | null) {
		if (!model) return null
		const {
			_id, tokens, userId, createdAt, updatedAt
		} = model
		return new TokenEntity({
			id: _id.toString(), userId, tokens, createdAt, updatedAt
		})
	}

	mapTo (entity: TokenEntity) {
		return {
			userId: entity.userId
		}
	}
}
