import { computed, ref } from 'vue'
import { UserEntity, UsersUseCases } from '@modules/users'
import { AuthDetails, AuthTypes } from '@modules/auth/domain/entities/auth'
import { AuthUseCases } from '@modules/auth'
import { useListener } from '@app/hooks/core/listener'
import { isClient } from '@utils/environment'

const globalObj = {
	auth: ref(null as AuthDetails | null),
	user: ref(null as UserEntity | null),
	listener: useListener(async () => {
		const id = globalObj.auth.value?.id as string | undefined
		if (!id) return () => {
		}
		const setUser = async (user: UserEntity) => {
			globalObj.user.value = user
		}
		const listeners = [
			await UsersUseCases.listenToOne(id, {
				created: setUser,
				updated: setUser,
				deleted: setUser
			})
		]
		return async () => await Promise.all(listeners.map((l) => l()))
	})
}

export const useAuth = () => {
	const id = computed({
		get: () => globalObj.auth.value?.id ?? '', set: () => {
		}
	})
	const bio = computed({
		get: () => globalObj.user.value?.bio, set: () => {
		}
	})

	const isLoggedIn = computed({
		get: () => !!id.value && !!globalObj.user.value, set: () => {
		}
	})
	const isEmailVerified = computed({
		get: () => !!globalObj.auth.value?.isVerified, set: () => {
		}
	})
	const isAdmin = computed({
		get: () => !!globalObj.user.value?.roles.isAdmin, set: () => {
		}
	})
	const hasPassword = computed({
		get: () => !!globalObj.auth.value?.authTypes.includes(AuthTypes.email),
		set: () => {
		}
	})

	const setAuthUser = async (details: AuthDetails | null) => {
		if (globalObj.listener) await globalObj.listener.close()
		globalObj.auth.value = details
		if (details?.id) {
			globalObj.user.value = await UsersUseCases.find(details.id)
		} else globalObj.user.value = null
	}

	const startProfileListener = async () => {
		await globalObj.listener.restart()
	}

	const signin = async (_: boolean) => {
		await Promise.all([
			startProfileListener()
		])
	}

	const signout = async () => {
		await AuthUseCases.sessionSignout()
		await setAuthUser(null)
		if (isClient()) window.location.assign('/admin/auth/signin')
	}

	const deleteAccount = async () => {
		await AuthUseCases.deleteAccount()
		await setAuthUser(null)
		if (isClient()) window.location.assign('/admin/auth/signin')
	}

	return {
		id, bio, user: globalObj.user, auth: globalObj.auth,
		isLoggedIn, isEmailVerified, isAdmin, hasPassword,
		setAuthUser, signin, signout, deleteAccount
	}
}
