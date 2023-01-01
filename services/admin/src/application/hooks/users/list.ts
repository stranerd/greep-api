import { onMounted, onUnmounted, ref } from 'vue'
import { UserEntity, UsersUseCases } from '@modules/users'
import { useErrorHandler, useListener, useLoadingHandler } from '@app/hooks/core/states'
import { addToArray } from '@utils/commons'

const globalObj = {
	users: ref([] as UserEntity[]),
	fetched: ref(false),
	hasMore: ref(false),
	count: ref(0),
	...useErrorHandler(),
	...useLoadingHandler()
}
const listener = useListener(async () => await UsersUseCases.listen({
	created: async (entity) => {
		addToArray(globalObj.users.value, entity, (e) => e.id, (e) => e.dates.createdAt)
	},
	updated: async (entity) => {
		addToArray(globalObj.users.value, entity, (e) => e.id, (e) => e.dates.createdAt)
	},
	deleted: async (entity) => {
		const index = globalObj.users.value.findIndex((q) => q.id === entity.id)
		if (index !== -1) globalObj.users.value.splice(index, 1)
	}
}, globalObj.users.value.at(-1)?.dates.createdAt))

export const useUsersList = () => {
	const fetchUsers = async () => {
		await globalObj.setError('')
		try {
			await globalObj.setLoading(true)
			const users = await UsersUseCases.get(globalObj.users.value.at(-1)?.dates.createdAt)
			globalObj.hasMore.value = !!users.pages.next
			if (!globalObj.fetched.value) globalObj.count.value = users.docs.total
			users.results.forEach((u) => addToArray(globalObj.users.value, u, (e) => e.id, (e) => e.dates.createdAt))
			globalObj.fetched.value = true
		} catch (error) {
			await globalObj.setError(error)
		}
		await globalObj.setLoading(false)
	}

	const fetchOlderUsers = async () => {
		await fetchUsers()
		await listener.restart()
	}

	onMounted(async () => {
		if (!globalObj.fetched.value && !globalObj.loading.value) await fetchUsers()
		await listener.start()
	})
	onUnmounted(async () => {
		await listener.close()
	})

	return { ...globalObj, fetchOlderUsers }
}
