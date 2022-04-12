import { MediaOutput } from '@stranerd/api-commons'

export interface UserUpdateInput {
	firstName: string
	lastName: string
	description: string
	photo: MediaOutput | null
	coverPhoto: MediaOutput | null
}

export interface RoleInput {
	userId: string
	role: string
	value: boolean
}

export interface RegisterInput {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	description: string
	photo: MediaOutput | null;
	coverPhoto: MediaOutput | null;
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