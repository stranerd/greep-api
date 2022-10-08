import {
	EmbeddedUser,
	UserBio,
	UserDates,
	UserDrivers,
	UserManager,
	UserManagerRequests,
	UserRoles,
	UserStatus
} from '../types'
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
	public readonly pushTokens: string[]

	constructor ({
		             id,
		             bio,
		             roles,
		             dates,
		             status,
		             drivers,
		             manager,
		             managerRequests,
		             pushTokens
	             }: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = bio ?? {}
		this.roles = roles ?? {}
		this.dates = dates
		this.status = status
		this.drivers = drivers
		this.manager = manager
		this.managerRequests = managerRequests
		this.pushTokens = pushTokens
	}

	isAdmin () {
		return this.roles['isAdmin'] ?? false
	}

	isDeleted () {
		return this.dates.deletedAt !== null
	}

	getEmbedded (): EmbeddedUser {
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
	drivers: UserDrivers
	manager: UserManager | null
	managerRequests: UserManagerRequests
	pushTokens: string[]
}