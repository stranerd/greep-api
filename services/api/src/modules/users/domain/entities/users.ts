import { BaseEntity } from 'equipped'
import {
	EmbeddedUser,
	UserAccount,
	UserBio,
	UserDates,
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

	ignoreInJSON = ['bio.email']

	constructor ({
		id,
		bio,
		roles,
		dates,
		status,
		account,
		type,
	}: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = bio ?? {}
		this.roles = roles ?? {}
		this.dates = dates
		this.status = status
		this.account = account
		this.type = type
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
}