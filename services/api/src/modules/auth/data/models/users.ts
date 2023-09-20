import { AuthRoles, AuthTypes, Enum, MediaOutput } from 'equipped'
import { AuthUserType } from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
	roles: AuthRoles
	signedUpAt: number
	lastSignedInAt: number
}

export interface UserToModel {
	username: string
	email: string
	password: string
	name: { first: string, last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	referrer: string | null
	type: AuthUserType | null
}