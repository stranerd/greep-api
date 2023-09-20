import { AuthUserType } from '@modules/auth'
import { AuthRoles, MediaOutput } from 'equipped'
import { UserMeta } from './activities'

export * from './activities'

export type UserBio = {
	type: AuthUserType | null
	username: string
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

export type UserAccount = {
	rankings: Record<UserRankings, { value: number, lastUpdatedAt: number }>
	meta: Record<UserMeta, number>
}

export enum UserRankings {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall'
}
