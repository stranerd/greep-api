import { BaseEntity } from 'equipped'
import { EmbeddedUser, UserAccount, UserBio, UserDates, UserRoles, UserStatus, UserType, UserTypeData } from '../types'

export class UserEntity extends BaseEntity<UserConstructorArgs> {
	ignoreInJSON = ['bio.email', 'bio.phone']

	constructor(data: UserConstructorArgs) {
		super(data)
		this.bio = data.bio ?? {}
		this.roles = data.roles ?? {}
	}

	isAdmin() {
		return this.roles['isAdmin'] ?? false
	}

	isDeleted() {
		return this.dates.deletedAt !== null
	}

	isDriver() {
		return this.type?.type === UserType.driver
	}

	isCustomer() {
		return this.type?.type === UserType.customer
	}

	getEmbedded(): EmbeddedUser {
		return {
			id: this.id,
			bio: { username: this.bio.username, name: this.bio.name, photo: this.bio.photo },
			roles: this.roles,
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
