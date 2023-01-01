import {
	EmbeddedUser,
	UserBio,
	UserDates,
	UserDrivers,
	UserManager,
	UserManagerRequests,
	UserPushTokens,
	UserRoles,
	UserStatus
} from '../types'
import { BaseEntity, parseMedia } from '@modules/core'
import { capitalize } from '@utils/commons'

type UserConstructorArgs = {
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

export const generateDefaultBio = (bio: Partial<UserBio>): UserBio => {
	const first = capitalize(bio?.name?.first ?? 'Anon')
	const last = capitalize(bio?.name?.last ?? 'Ymous')
	const full = capitalize(bio?.name?.full ?? (first + ' ' + last))
	const email = bio?.email ?? 'anon@ymous.com'
	const description = bio?.description ?? ''
	const photo = bio?.photo ? parseMedia(bio.photo) : null
	return { name: { first, last, full }, email, description, photo }
}

export const generateDefaultRoles = (roles: Partial<UserRoles>): UserRoles => ({
	isAdmin: roles?.isAdmin ?? false
})

export const generateEmbeddedUser = (user: EmbeddedUser): EmbeddedUser => ({
	...user,
	bio: generateDefaultBio(user.bio),
	roles: generateDefaultRoles(user.roles)
})

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly status: UserStatus
	public readonly dates: UserDates
	public readonly manager: UserManager
	public readonly drivers: UserDrivers
	public readonly managerRequests: UserManagerRequests
	public readonly pushTokens: UserPushTokens

	constructor ({
		             id,
		             bio,
		             roles,
		             status,
		             dates,
		             manager, drivers, managerRequests, pushTokens
	             }: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = generateDefaultBio(bio)
		this.roles = generateDefaultRoles(roles)
		this.manager = manager
		this.drivers = drivers
		this.managerRequests = managerRequests
		this.pushTokens = pushTokens
		this.status = status
		this.dates = dates
	}

	get isOnline () {
		return this.status.connections.length > 0
	}

	get lastSeen () {
		return this.isOnline ? Date.now() : this.status.lastUpdatedAt
	}

	get driverIds () {
		return this.drivers.map((d) => d.driverId)
	}

	get managerRequestIds () {
		return this.managerRequests.map((d) => d.managerId)
	}

	get connections () {
		const connections = this.driverIds.concat(...this.managerRequestIds)
		if (this.manager) connections.push(this.manager.managerId)
		return connections
	}
}
