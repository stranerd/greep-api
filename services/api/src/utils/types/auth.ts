export enum AuthRole {
	isAdmin = 'isAdmin',
	isSuperAdmin = 'isSuperAdmin',
}

export type AuthRoles = Partial<Record<AuthRole, boolean>>