import { onMounted, onUnmounted, Ref, ref } from 'vue'
import { CustomerEntity, CustomersUseCases } from '@modules/users'
import { useErrorHandler, useListener, useLoadingHandler } from '@app/hooks/core/states'
import { addToArray } from '@utils/commons'

const globalObj = {} as Record<string, {
	customers: Ref<CustomerEntity[]>
	fetched: Ref<boolean>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useCustomersList = (userId: string) => {
	const listener = useListener(async () => await CustomersUseCases.listen(userId, {
		created: async (entity) => {
			addToArray(globalObj[userId].customers.value, entity, (e) => e.id, (e) => e.name, true)
		},
		updated: async (entity) => {
			addToArray(globalObj[userId].customers.value, entity, (e) => e.id, (e) => e.name, true)
		},
		deleted: async (entity) => {
			const index = globalObj[userId].customers.value.findIndex((q) => q.id === entity.id)
			if (index !== -1) globalObj[userId].customers.value.splice(index, 1)
		}
	}))

	if (globalObj[userId] === undefined) globalObj[userId] = {
		customers: ref([]),
		fetched: ref(false),
		...useLoadingHandler(),
		...useErrorHandler()
	}

	const fetchCustomers = async () => {
		await globalObj[userId].setError('')
		try {
			await globalObj[userId].setLoading(true)
			const customers = await CustomersUseCases.get(userId)
			customers.results.forEach((u) => addToArray(globalObj[userId].customers.value, u, (e) => e.id, (e) => e.name))
			globalObj[userId].fetched.value = true
		} catch (error) {
			await globalObj[userId].setError(error)
		}
		await globalObj[userId].setLoading(false)
	}

	onMounted(async () => {
		if (!globalObj[userId].fetched.value && !globalObj[userId].loading.value) await fetchCustomers()
		await listener.start()
	})
	onUnmounted(async () => {
		await listener.close()
	})

	return { ...globalObj }
}
