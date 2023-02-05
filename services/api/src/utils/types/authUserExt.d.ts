import { AuthRoles } from '@utils/types/auth'

declare module '@stranerd/api-commons/lib/utils/authUser' {
	interface AuthUser {
		email: string
		roles: AuthRoles
		isVerified: boolean
	}
}