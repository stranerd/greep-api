import { BaseEntity, Validation } from 'equipped'
import { EmbeddedUser, UserAccount, UserBio, UserDates, UserRoles, UserStatus, UserType, UserTypeData, UserVendorData } from '../types'

export class UserEntity extends BaseEntity<UserConstructorArgs> {
	ignoreInJSON = ['bio.email', 'bio.phone']

	constructor(data: UserConstructorArgs) {
		super(data)
		this.bio = generateDefaultBio(data.bio ?? {})
		this.roles = generateDefaultRoles(data.roles)
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
	vendor: UserVendorData | null
}

const generateDefaultBio = (bio: Partial<UserBio>): UserBio => {
	const first = Validation.capitalize(bio?.name?.first ?? 'Anon')
	const last = Validation.capitalize(bio?.name?.last ?? 'Ymous')
	const full = Validation.capitalize(bio?.name?.full ?? first + ' ' + last)
	const email = bio?.email ?? 'anon@ymous.com'
	const photo = bio?.photo ?? null
	const phone = bio?.phone ?? null
	const username = bio?.username ?? full
	return { name: { first, last, full }, email, photo, phone, username }
}

const generateDefaultRoles = (roles: Partial<UserRoles>): UserRoles => roles ?? {}

export const generateDefaultUser = (user: Partial<EmbeddedUser>): EmbeddedUser => {
	const id = user?.id ?? ''
	const bio = generateDefaultBio(user?.bio ?? {})
	const roles = generateDefaultRoles(user?.roles ?? {})
	return {
		id,
		bio: { name: bio.name, photo: bio.photo, username: bio.username },
		roles,
	}
}
