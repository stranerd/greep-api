import { AuthTypes, BaseEntity, MediaOutput } from '@stranerd/api-commons'
import { UserUpdateInput } from '../types'
import { AuthRoles } from '@utils/types/auth'

export class AuthUserEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly password: string
	public readonly description: string
	public readonly name: { first: string, middle: string, last: string }
	public readonly photo: MediaOutput | null
	public readonly isVerified: boolean
	public readonly authTypes: AuthTypes[]
	public readonly roles: AuthRoles
	public readonly lastSignedInAt: number
	public readonly signedUpAt: number

	constructor (data: UserConstructorArgs) {
		super()
		this.id = data.id
		this.email = data.email
		this.password = data.password
		this.name = data.name
		this.description = data.description
		this.photo = data.photo
		this.isVerified = data.isVerified
		this.authTypes = data.authTypes
		this.roles = data.roles ?? {}
		this.lastSignedInAt = data.lastSignedInAt
		this.signedUpAt = data.signedUpAt
	}

	get allNames () {
		return {
			...this.name,
			full: [this.name.first, this.name.middle, this.name.last].join(' ').replaceAll('  ', ' ')
		}
	}

	static bioKeys (): (keyof (UserUpdateInput & { email: string }))[] {
		return ['name', 'email', 'photo', 'description']
	}
}

interface UserConstructorArgs {
	id: string;
	email: string;
	password: string;
	description: string;
	roles: AuthRoles;
	name: { first: string, middle: string, last: string }
	photo: MediaOutput | null;
	isVerified: boolean;
	authTypes: AuthTypes[];
	lastSignedInAt: number;
	signedUpAt: number
}