export { }

declare module '@stranerd/api-commons/lib/utils/authUser' {
    interface AuthUser {
        email: string
        isVerified: boolean
    }
}