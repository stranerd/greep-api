import { MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types/auth'

export * from './transactions'

export type UserBio = {
	email: string
	name: {
		first: string
		middle: string
		last: string
		full: string
	}
	description: string
	photo: MediaOutput | null
	coverPhoto: MediaOutput | null
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