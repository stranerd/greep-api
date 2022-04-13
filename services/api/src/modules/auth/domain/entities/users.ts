import { AuthRoles, AuthTypes, BaseEntity, MediaOutput } from '@stranerd/api-commons'
import { UserUpdateInput } from '../types'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly email: string
	public readonly password: string
	public readonly description: string
	public readonly name: { first: string, middle: string, last: string }
	public readonly photo: MediaOutput | null
	public readonly coverPhoto: MediaOutput | null
	public readonly isVerified: boolean
	public readonly authTypes: AuthTypes[]
	public readonly roles: AuthRoles
	public readonly referrer: string | null
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
		this.coverPhoto = data.coverPhoto
		this.isVerified = data.isVerified
		this.authTypes = data.authTypes
		this.referrer = data.referrer
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
		return ['name', 'email', 'photo', 'coverPhoto', 'description']
	}
}

export interface UserConstructorArgs {
	id: string;
	email: string;
	password: string;
	description: string;
	roles: AuthRoles;
	name: { first: string, middle: string, last: string }
	photo: MediaOutput | null;
	coverPhoto: MediaOutput | null;
	isVerified: boolean;
	authTypes: AuthTypes[];
	referrer: string | null;
	lastSignedInAt: number;
	signedUpAt: number
}