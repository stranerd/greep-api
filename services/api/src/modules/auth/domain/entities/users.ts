import { AuthRoles, AuthTypes, BaseEntity, Enum, MediaOutput } from 'equipped'
import { Phone, UserUpdateInput } from '../types'

export class AuthUserEntity extends BaseEntity<UserConstructorArgs> {
	constructor(data: UserConstructorArgs) {
		data.roles ??= {}
		super(data)
	}

	get allNames() {
		return {
			...this.name,
			full: [this.name.first, this.name.last].join(' ').replaceAll('  ', ' '),
		}
	}

	static bioKeys(): (keyof (UserUpdateInput & { email: string }))[] {
		return ['username', 'name', 'email', 'photo', 'phone']
	}
}

interface UserConstructorArgs {
	id: string
	username: string
	email: string
	password: string
	roles: AuthRoles
	name: { first: string; last: string }
	photo: MediaOutput | null
	phone: Phone | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
	lastSignedInAt: number
	signedUpAt: number
	referrer: string | null
}
