import { AuthRoles, AuthTypes, BaseEntity, Enum, MediaOutput } from 'equipped'
import { AuthUserType, UserUpdateInput } from '../types'

export class AuthUserEntity extends BaseEntity {
	public readonly id: string
	public readonly username: string
	public readonly email: string
	public readonly password: string
	public readonly name: { first: string, last: string }
	public readonly photo: MediaOutput | null
	public readonly isVerified: boolean
	public readonly authTypes: Enum<typeof AuthTypes>[]
	public readonly roles: AuthRoles
	public readonly referrer: string | null
	public readonly type: AuthUserType | null
	public readonly lastSignedInAt: number
	public readonly signedUpAt: number

	constructor (data: UserConstructorArgs) {
		super()
		this.id = data.id
		this.username = data.username
		this.email = data.email
		this.password = data.password
		this.name = data.name
		this.photo = data.photo
		this.isVerified = data.isVerified
		this.authTypes = data.authTypes
		this.roles = data.roles ?? {}
		this.referrer = data.referrer
		this.type = data.type
		this.lastSignedInAt = data.lastSignedInAt
		this.signedUpAt = data.signedUpAt
	}

	get allNames() {
		return {
			...this.name,
			full: [this.name.first, this.name.last].join(' ').replaceAll('  ', ' ')
		}
	}

	static bioKeys(): (keyof (UserUpdateInput & { email: string, type: AuthUserType }))[] {
		return ['username', 'name', 'email', 'photo', 'type']
	}
}

interface UserConstructorArgs {
	id: string
	username: string
	email: string
	password: string
	roles: AuthRoles
	name: { first: string, last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	lastSignedInAt: number
	signedUpAt: number
	referrer: string | null
	type: AuthUserType | null
}