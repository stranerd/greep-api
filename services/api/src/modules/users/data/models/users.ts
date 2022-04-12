import { UserBio, UserDates, UserRoles, UserStatus } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string;
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
}
