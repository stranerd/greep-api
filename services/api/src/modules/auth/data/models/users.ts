import { AuthRoles, AuthTypes, Enum, MediaOutput } from 'equipped'
import { Phone } from '../../domain/types'

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
	name: { first: string; last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	phone: Phone | null
	referrer: string | null
}
