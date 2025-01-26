import { BaseEntity, Validation } from 'equipped'
import {
	EmbeddedUser,
	UserAccount,
	UserBio,
	UserDates,
	UserRoles,
	UserStatus,
	UserType,
	UserTypeData,
	UserVendorData,
	UserVendorType,
} from '../types'

export class UserEntity extends BaseEntity<UserConstructorArgs, 'bio.email' | 'bio.phone'> {
	__ignoreInJSON = ['bio.email' as const, 'bio.phone' as const]

	constructor(data: UserConstructorArgs) {
		if (Array.isArray(data.account.location))
			data.account.location = {
				coords: data.account.location as any,
				location: '',
				description: '',
				hash: '',
			}
		super(data)
		this.bio = generateDefaultBio(data.bio ?? {})
		this.roles = generateDefaultRoles(data.roles)
		this.vendor ??= { tags: {}, schedule: null, averagePrepTimeInMins: null }
		this.vendor.tags = Object.fromEntries(Object.entries(this.vendor.tags ?? {}).filter(([_, val]) => val > 0))
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

	isVendor() {
		return this.type?.type === UserType.vendor
	}

	isVendorFoods() {
		return this.type?.type === UserType.vendor && this.type.vendorType === UserVendorType.foods
	}

	isVendorItems() {
		return this.type?.type === UserType.vendor && this.type.vendorType === UserVendorType.items
	}

	isCustomer() {
		return this.type?.type === UserType.customer
	}

	get publicName() {
		if (this.type?.type === UserType.vendor) return this.type.name
		return this.bio.name.full
	}

	getEmbedded(): EmbeddedUser {
		return {
			id: this.id,
			bio: { username: this.bio.username, name: this.bio.name, photo: this.bio.photo },
			publicName: this.publicName,
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
	type: UserTypeData | null
	vendor: UserVendorData
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
	const publicName = user.publicName ?? bio.name.full
	return {
		id,
		bio: { name: bio.name, photo: bio.photo, username: bio.username },
		roles,
		publicName,
	}
}
