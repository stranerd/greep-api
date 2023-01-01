import { Media } from '@modules/core'

export * from './transaction'
export * from './trip'

export enum RankingTimes {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall'
}

export interface UserBio {
	name: {
		first: string
		last: string
		full: string
	}
	email: string
	description: string
	photo: Media | null
}

export interface UserRoles {
	isAdmin: boolean
}

export type EmbeddedUser = {
	id: string
	bio: UserBio
	roles: UserRoles
}

export interface UserStatus {
	connections: string[]
	lastUpdatedAt: number
}

export interface UserDates {
	createdAt: number
	deletedAt: number | null
}

export type UserManager = { managerId: string, commission: number } | null
export type UserManagerRequests = { managerId: string, commission: number }[]
export type UserDrivers = { driverId: string, commission: number }[]
export type UserPushTokens = string[]
