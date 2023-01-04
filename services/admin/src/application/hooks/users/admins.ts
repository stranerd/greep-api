import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@app/hooks/core/states'
import { UserEntity } from '@modules/users'
import { Alert } from '@utils/dialog'
import { AuthUseCases } from '@modules/auth'

const globalObj = {
	...useErrorHandler(),
	...useSuccessHandler(),
	...useLoadingHandler()
}

export const useAdminsList = () => {
	const toggleAdmin = async (user: UserEntity) => {
		const value = !user.roles.isAdmin
		await globalObj.setError('')
		const accepted = await Alert({
			message: `Are you sure you want to ${value ? 'upgrade this user to an admin' : 'downgrade this user from admin'}`,
			confirmButtonText: 'Yes, continue'
		})
		if (accepted) {
			await globalObj.setLoading(true)
			try {
				await AuthUseCases.updateRole(user.id, 'isAdmin', value)
				user.roles.isAdmin = value
				await globalObj.setMessage(`Successfully ${value ? 'upgraded to' : 'downgraded from'} admin`)
			} catch (error) {
				await globalObj.setError(error)
			}
			await globalObj.setLoading(false)
		}
	}

	return { ...globalObj, toggleAdmin }
}
