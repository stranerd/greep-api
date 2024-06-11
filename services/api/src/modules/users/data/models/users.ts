import { UserAccount, UserBio, UserDates, UserRoles, UserStatus, UserTypeData, UserVendorData } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	type: UserTypeData
	account: UserAccount
	vendor: UserVendorData
}
