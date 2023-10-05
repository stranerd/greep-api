import {
	UserAccount,
	UserBio,
	UserDates,
	UserDrivers,
	UserManager,
	UserManagerRequests,
	UserRoles,
	UserStatus,
	UserTypeData
} from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	type: UserTypeData
	drivers: UserDrivers
	manager: UserManager | null
	managerRequests: UserManagerRequests
	account: UserAccount
}
