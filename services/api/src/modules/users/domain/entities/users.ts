import { UserBio, UserDates, UserDrivers, UserManager, UserManagerRequests, UserRoles, UserStatus } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly status: UserStatus
	public readonly drivers: UserDrivers
	public readonly manager: UserManager | null
	public readonly managerRequests: UserManagerRequests

	constructor ({ id, bio, roles, dates, status, drivers, manager, managerRequests }: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = bio ?? {}
		this.roles = roles ?? {}
		this.dates = dates
		this.status = status
		this.drivers = drivers
		this.manager = manager
		this.managerRequests = managerRequests
	}

	isAdmin () {
		return this.roles['isAdmin'] ?? false
	}
}

type UserConstructorArgs = {
	id: string
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	drivers: UserDrivers
	manager: UserManager | null
	managerRequests: UserManagerRequests
}