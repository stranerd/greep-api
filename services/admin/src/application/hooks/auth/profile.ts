import { watch } from 'vue'
import { useAuth } from '@app/hooks/auth/auth'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@app/hooks/core/states'
import { AuthUseCases, ProfileUpdateFactory } from '@modules/auth'

export const useProfileUpdate = () => {
	const factory = new ProfileUpdateFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const updateProfile = async (skipAlert = false) => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await AuthUseCases.updateProfile(factory)
				await setMessage('Profile updated successfully!', skipAlert)
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, updateProfile }
}
