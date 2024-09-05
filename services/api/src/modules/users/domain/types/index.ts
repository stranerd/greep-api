import { Phone } from '@modules/auth'
import { Location, Ratings, Time } from '@utils/types'
import { AuthRoles, MediaOutput } from 'equipped'
import { UserMeta } from './activities'

export * from './activities'

export type UserBio = {
	username: string
	email: string
	name: {
		first: string
		last: string
		full: string
	}
	photo: MediaOutput | null
	phone: Phone | null
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

export type EmbeddedUser = {
	id: string
	bio: Omit<UserBio, 'email' | 'phone'>
	roles: UserRoles
	publicName: string
}

export type UserAccount = {
	rankings: Record<UserRankings, { value: number; lastUpdatedAt: number }>
	meta: Record<UserMeta, number>
	ratings: Ratings
	application: {
		accepted: boolean
		message: string
	} | null
	trips: Record<
		string,
		{
			trips: number
			debt: number
		}
	>
	location: Location | null
	savedLocations: Location[]
	settings: {
		notifications: boolean
		driverAvailable: boolean
	}
}

export enum UserRankings {
	daily = 'daily',
	weekly = 'weekly',
	monthly = 'monthly',
	overall = 'overall',
}

export enum UserType {
	driver = 'driver',
	customer = 'customer',
	vendor = 'vendor',
}

export enum UserVendorType {
	foods = 'foods',
	items = 'items',
}

export enum UserVendorBusinessDays {
	sun = 'sun',
	mon = 'mon',
	tue = 'tue',
	wed = 'wed',
	thu = 'thu',
	fri = 'fri',
	sat = 'sat',
}

export type BusinessTime = {
	timezone: string
	schedule: Record<UserVendorBusinessDays, { from: Time; to: Time } | null>
} | null

export type UserTypeData =
	| {
			type: UserType.driver
			license: MediaOutput
	  }
	| {
			type: UserType.vendor
			vendorType: UserVendorType
			name: string
			banner: MediaOutput | null
			email: string | null
			website: string | null
			location: Location
			passport: MediaOutput | null
			residentPermit: MediaOutput | null
	  }
	| {
			type: UserType.customer
			passport: MediaOutput | null
			studentId: MediaOutput | null
			residentPermit: MediaOutput | null
	  }

export type UserVendorData = {
	schedule: BusinessTime
	tags: Record<string, number>
	averagePrepTimeInMins: { from: number; to: number } | null
}
