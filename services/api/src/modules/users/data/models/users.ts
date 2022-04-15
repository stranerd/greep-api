import { UserBio, UserDates, UserDrivers, UserManager, UserRoles, UserStatus } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string;
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	drivers: UserDrivers
	manager: UserManager | null
}
