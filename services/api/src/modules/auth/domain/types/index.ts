import { MediaOutput } from 'equipped'

export type Phone = {
	code: string
	number: string
}

export interface UserUpdateInput {
	name: { first: string; last: string }
	photo: MediaOutput | null
	username: string
	phone: Phone | null
}

export interface RoleInput {
	userId: string
	roles: Record<string, boolean>
}

export interface RegisterInput extends UserUpdateInput {
	email: string
	password: string
	referrer: string | null
}

export interface PasswordResetInput {
	token: string
	password: string
}

export interface Credential {
	email: string
	password: string
}

export interface AuthOutput {
	accessToken: string
	refreshToken: string
}
