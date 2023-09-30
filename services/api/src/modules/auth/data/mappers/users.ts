import { BaseMapper } from 'equipped'
import { AuthUserEntity } from '../../domain/entities/users'
import { UserFromModel, UserToModel } from '../models/users'

export class UserMapper extends BaseMapper<UserFromModel, UserToModel, AuthUserEntity> {
	mapFrom(param: UserFromModel | null) {
		return !param ? null : new AuthUserEntity({
			id: param._id.toString(),
			username: param.username,
			email: param.email,
			password: param.password,
			roles: param.roles,
			name: param.name,
			photo: param.photo,
			isVerified: param.isVerified,
			authTypes: param.authTypes,
			referrer: param.referrer,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt
		})
	}

	mapTo(param: AuthUserEntity) {
		return {
			username: param.username,
			email: param.email,
			password: param.password,
			roles: param.roles,
			name: param.name,
			photo: param.photo,
			isVerified: param.isVerified,
			authTypes: param.authTypes,
			referrer: param.referrer,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt
		}
	}
}