import { AuthRoles, MediaOutput } from '@stranerd/api-commons'

export type UserBio = {
	email: string
	firstName: string
	lastName: string
	fullName: string
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