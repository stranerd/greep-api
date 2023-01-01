import { AuthUseCases } from '@modules/auth'
import { deleteTokens, getTokens } from '@utils/tokens'
import { useAuth } from '@app/hooks/auth/auth'
import { setEmailVerificationEmail } from '@app/hooks/auth/signin'

export default defineNuxtPlugin(async () => {
	const { accessToken } = await getTokens()
	if (!accessToken) return
	const user = await AuthUseCases.getAuthUser().catch(() => null)
	if (!user) return await deleteTokens()
	const { isLoggedIn, isEmailVerified, signin, setAuthUser } = useAuth()
	await setAuthUser(user)
	if (!isEmailVerified.value) {
		setEmailVerificationEmail(user.email)
		// TODO: figure out how to access router
		// await router.push('/auth/verify')
	}
	if (isLoggedIn.value) await signin(true)
})
