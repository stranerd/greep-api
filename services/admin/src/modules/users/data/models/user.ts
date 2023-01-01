import {
	UserBio,
	UserDates,
	UserDrivers,
	UserManager,
	UserManagerRequests,
	UserPushTokens,
	UserRoles,
	UserStatus
} from '../../domain/types'

export interface UserFromModel extends UserToModel {
	id: string
	bio: UserBio
	roles: UserRoles
	status: UserStatus
	dates: UserDates
	manager: UserManager
	drivers: UserDrivers
	managerRequests: UserManagerRequests
	pushTokens: UserPushTokens
}

export type UserToModel = Record<string, unknown>
