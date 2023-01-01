import { onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { UserEntity, UsersUseCases } from '@modules/users'
import { useErrorHandler, useListener, useLoadingHandler } from '@app/hooks/core/states'
import { useAuth } from '@app/hooks/auth/auth'
import { addToArray } from '@utils/commons'

const globalObj = {} as Record<string, {
	user: Ref<UserEntity | null>
	fetched: Ref<boolean>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

const driversGlobal = {} as Record<string, {
	users: Ref<UserEntity[]>
	fetched: Ref<boolean>
	listener: ReturnType<typeof useListener>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useUser = (userId: string) => {
	const { id, user } = useAuth()

	if (globalObj[userId] === undefined) globalObj[userId] = {
		user: ref(null),
		fetched: ref(false),
		...useLoadingHandler(),
		...useErrorHandler()
	}

	const fetchUser = async () => {
		await globalObj[userId].setError('')
		try {
			await globalObj[userId].setLoading(true)
			if (id.value && id.value === userId) globalObj[userId].user.value = user.value
			else globalObj[userId].user.value = await UsersUseCases.find(userId)
			globalObj[userId].fetched.value = true
		} catch (error) {
			await globalObj[userId].setError(error)
		}
		await globalObj[userId].setLoading(false)
	}

	const listener = useListener(async () => {
		if (id.value && id.value === userId) {
			watch(user, () => globalObj[userId].user.value = user.value)
			return () => {
			}
		}
		const callback = async (user: UserEntity) => {
			globalObj[userId].user.value = user
		}
		return await UsersUseCases.listenToOne(userId, { created: callback, updated: callback, deleted: callback })
	})

	onMounted(async () => {
		if (!globalObj[userId].fetched.value && !globalObj[userId].loading.value) await fetchUser()
		if (globalObj[userId].user.value) await listener.start()
	})
	onUnmounted(async () => {
		await listener.close()
	})

	return {
		error: globalObj[userId].error,
		loading: globalObj[userId].loading,
		user: globalObj[userId].user
	}
}

export const useUserManagerAndDrivers = (user: UserEntity) => {
	const listenerFn = async () => {
		return UsersUseCases.listenToUsersInList(user.connections, {
			created: async (entity) => {
				addToArray(driversGlobal[user.id].users.value, entity, (e) => e.id, (e) => e.bio.name.full, true)
			},
			updated: async (entity) => {
				addToArray(driversGlobal[user.id].users.value, entity, (e) => e.id, (e) => e.bio.name.full, true)
			},
			deleted: async (entity) => {
				const index = driversGlobal[user.id].users.value.findIndex((q) => q.id === entity.id)
				if (index !== -1) driversGlobal[user.id].users.value.splice(index, 1)
			}
		})
	}

	if (driversGlobal[user.id] === undefined) driversGlobal[user.id] = {
		users: ref([]),
		fetched: ref(false),
		listener: useListener(listenerFn),
		...useErrorHandler(),
		...useLoadingHandler()
	}

	const fetchUsers = async () => {
		await driversGlobal[user.id].setError('')
		try {
			await driversGlobal[user.id].setLoading(true)
			const users = await UsersUseCases.getUsersInList(user.connections)
			users.forEach((u) => addToArray(driversGlobal[user.id].users.value, u, (e) => e.id, (e) => e.bio.name.full, true))
			driversGlobal[user.id].fetched.value = true
		} catch (error) {
			await driversGlobal[user.id].setError(error)
		}
		await driversGlobal[user.id].setLoading(false)
	}
	onMounted(async () => {
		if (!driversGlobal[user.id].fetched.value && !driversGlobal[user.id].loading.value) await fetchUsers()
		await driversGlobal[user.id].listener.reset(listenerFn)
	})
	onUnmounted(async () => {
		await driversGlobal[user.id].listener.close()
	})

	const manager = computed(() => driversGlobal[user.id].users.value.find((u) => user.manager?.managerId === u.id))
	const drivers = computed(() => driversGlobal[user.id].users.value.filter((u) => user.driverIds.includes(u.id)))
	const managerRequests = computed(() => driversGlobal[user.id].users.value.filter((u) => user.managerRequestIds.includes(u.id)))

	return { ...driversGlobal[user.id], manager, drivers, managerRequests }
}
