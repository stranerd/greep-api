import { AuthRoles, MediaOutput } from '@stranerd/api-commons'

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