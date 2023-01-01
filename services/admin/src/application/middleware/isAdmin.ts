import { useAuth } from '@app/hooks/auth/auth'
import { storage } from '@utils/storage'
import { REDIRECT_SESSION_NAME } from '@utils/constants'

export default defineNuxtRouteMiddleware(async (to) => {
	const { isLoggedIn, isEmailVerified, isAdmin } = useAuth()
	if (!isLoggedIn.value) {
		if (!to.fullPath.startsWith('/auth/')) await storage.set(REDIRECT_SESSION_NAME, to.fullPath)
		return navigateTo('/auth/signin')
	}
	if (!isEmailVerified.value) {
		if (!to.fullPath.startsWith('/auth/')) await storage.set(REDIRECT_SESSION_NAME, to.fullPath)
		return navigateTo('/auth/verify')
	}
	if (!isAdmin.value) return navigateTo('/unauthorized')
})
