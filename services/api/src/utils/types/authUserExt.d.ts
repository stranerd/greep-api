import { AuthRoles } from '@utils/types/auth'

export {}

declare module '@stranerd/api-commons/lib/utils/authUser' {
	interface AuthUser {
		email: string
		roles: AuthRoles
		isVerified: boolean
	}
}