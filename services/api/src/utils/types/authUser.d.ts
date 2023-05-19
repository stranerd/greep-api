import { AuthUserType } from '@modules/auth'

declare module 'equipped/lib/utils/authUser' {
    interface AuthUser {
        type: AuthUserType | null
        email: string
        isVerified: boolean
    }
}