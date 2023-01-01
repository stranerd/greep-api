import { Media } from '@modules/core'

export type AuthUser = {
	email: string
	password: string
}

export type NewUser = {
	firstName: string
	lastName: string
	email: string
	password: string
	description: string
	photo: Media | null
}

export type ProfileUpdate = Omit<NewUser, 'password' | 'email'>

export type PasswordUpdate = {
	oldPassword: string
	password: string
}

export enum AuthTypes {
	google = 'google',
	email = 'email',
	facebook = 'facebook',
	twitter = 'twitter',
	apple = 'apple'
}

export type AfterAuthUser = {
	accessToken: string
	refreshToken: string
	user: AuthDetails
}

export type AuthDetails = {
	id: string
	name: {
		first: string
		middle: string
		last: string
	}
	allName: {
		first: string
		middle: string
		last: string
		full: string
	}
	email: string
	description: string
	isVerified: boolean
	roles: Record<string, Record<string, boolean>>
	authTypes: AuthTypes[]
}

export type AuthExtras = {}
