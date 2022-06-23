import {
	UserBio,
	UserDates,
	UserDrivers,
	UserManager,
	UserManagerRequests,
	UserRoles,
	UserStatus
} from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	drivers: UserDrivers
	manager: UserManager | null
	managerRequests: UserManagerRequests
	pushTokens: string[]
}
