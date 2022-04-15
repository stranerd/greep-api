import { MediaOutput } from '@stranerd/api-commons'

export interface UserUpdateInput {
	name: { first: string, middle: string, last: string }
	description: string
	photo: MediaOutput | null
	coverPhoto: MediaOutput | null
}

export interface RoleInput {
	userId: string
	roles: Record<string, boolean>
}

export interface RegisterInput extends UserUpdateInput {
	email: string;
	password: string;
	referrer: string | null;
}

export interface PasswordResetInput {
	token: string;
	password: string;
}

export interface Credential {
	email: string;
	password: string;
}

export interface AuthOutput {
	accessToken: string;
	refreshToken: string;
}