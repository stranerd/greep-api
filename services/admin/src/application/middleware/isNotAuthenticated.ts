import { useAuth } from '@app/hooks/auth/auth'

export default defineNuxtRouteMiddleware(async () => {
	if (useAuth().isLoggedIn.value) return navigateTo('/')
})
