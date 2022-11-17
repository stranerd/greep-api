import { MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types'

export * from './transactions'
export * from './trips'

export type UserBio = {
	email: string
	name: {
		first: string
		last: string
		full: string
	}
	photo: MediaOutput | null
}

export type UserRoles = AuthRoles

export type UserDates = {
	createdAt: number
	deletedAt: number | null
}

export type UserStatus = {
	connections: string[]
	lastUpdatedAt: number
}

export type UserDrivers = {
	driverId: string
	commission: number
}[]

export type UserManager = {
	managerId: string
	commission: number
}

export type UserManagerRequests = {
	managerId: string
	commission: number
}[]

export type EmbeddedUser = {
	id: string
	bio: UserBio
	roles: UserRoles
}