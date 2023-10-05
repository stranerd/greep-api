import { BaseEntity } from 'equipped'
import {
	EmbeddedUser,
	UserAccount,
	UserBio,
	UserDates,
	UserDrivers,
	UserManager,
	UserManagerRequests,
	UserRoles,
	UserStatus,
	UserTypeData
} from '../types'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly status: UserStatus
	public readonly account: UserAccount
	public readonly type: UserTypeData
	public readonly drivers: UserDrivers
	public readonly manager: UserManager | null
	public readonly managerRequests: UserManagerRequests

	ignoreInJSON = ['bio.email']

	constructor ({
		id,
		bio,
		roles,
		dates,
		status,
		account,
		type,
		drivers,
		manager,
		managerRequests,
	}: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = bio ?? {}
		this.roles = roles ?? {}
		this.dates = dates
		this.status = status
		this.account = account
		this.type = type
		this.drivers = drivers
		this.manager = manager
		this.managerRequests = managerRequests
	}

	isAdmin() {
		return this.roles['isAdmin'] ?? false
	}

	isDeleted() {
		return this.dates.deletedAt !== null
	}

	getEmbedded(): EmbeddedUser {
		return {
			id: this.id,
			bio: this.bio,
			roles: this.roles
		}
	}
}

type UserConstructorArgs = {
	id: string
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	status: UserStatus
	account: UserAccount
	type: UserTypeData
	drivers: UserDrivers
	manager: UserManager | null
	managerRequests: UserManagerRequests
}