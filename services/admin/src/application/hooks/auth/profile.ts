import { Ref, ref, watch } from 'vue'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@app/hooks/core/states'
import { AuthUseCases, ProfileUpdateFactory } from '@modules/auth'
import { useAuth } from '@app/hooks/auth/auth'

export const useProfileUpdate = () => {
	const factory = ref(new ProfileUpdateFactory()) as Ref<ProfileUpdateFactory>
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.value.loadEntity(user.value)
	watch(user, () => user.value && factory.value.loadEntity(user.value))

	const updateProfile = async (skipAlert = false) => {
		await setError('')
		if (factory.value.valid && !loading.value) {
			try {
				await setLoading(true)
				await AuthUseCases.updateProfile(factory.value)
				await setMessage('Profile updated successfully!', skipAlert)
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.value.validateAll()
	}

	return { error, loading, factory, updateProfile }
}
