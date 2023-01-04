import { onMounted, onUnmounted, ref, Ref } from 'vue'
import { TransactionEntity, TransactionsUseCases } from '@modules/users'
import { useErrorHandler, useListener, useLoadingHandler } from '@app/hooks/core/states'
import { addToArray } from '@utils/commons'

const globalObj = {} as Record<string, {
	transactions: Ref<TransactionEntity[]>,
	fetched: Ref<boolean>,
	hasMore: Ref<boolean>,
	count: Ref<number>,
	searchMode: Ref<boolean>,
	searchValue: Ref<string>,
	searchResults: Ref<TransactionEntity[]>
} & ReturnType<typeof useErrorHandler> & ReturnType<typeof useLoadingHandler>>

export const useTransactionsList = (userId: string) => {
	const listener = useListener(async () => await TransactionsUseCases.listen(userId, {
		created: async (entity) => {
			addToArray(globalObj[userId].transactions.value, entity, (e) => e.id, (e) => e.createdAt)
		},
		updated: async (entity) => {
			addToArray(globalObj[userId].transactions.value, entity, (e) => e.id, (e) => e.createdAt)
		},
		deleted: async (entity) => {
			const index = globalObj[userId].transactions.value.findIndex((q) => q.id === entity.id)
			if (index !== -1) globalObj[userId].transactions.value.splice(index, 1)
		}
	}, globalObj[userId].transactions.value.at(-1)?.createdAt))

	if (globalObj[userId] === undefined) globalObj[userId] = {
		transactions: ref([]),
		fetched: ref(false),
		hasMore: ref(false),
		count: ref(0),
		searchMode: ref(false),
		searchValue: ref(''),
		searchResults: ref([]),
		...useLoadingHandler(),
		...useErrorHandler()
	}

	const fetchTransactions = async () => {
		await globalObj[userId].setError('')
		try {
			await globalObj[userId].setLoading(true)
			const transactions = await TransactionsUseCases.get(userId, globalObj[userId].transactions.value.at(-1)?.createdAt)
			globalObj[userId].hasMore.value = !!transactions.pages.next
			if (!globalObj[userId].fetched.value) globalObj[userId].count.value = transactions.docs.total
			transactions.results.forEach((u) => addToArray(globalObj[userId].transactions.value, u, (e) => e.id, (e) => e.createdAt))
			globalObj[userId].fetched.value = true
		} catch (error) {
			await globalObj[userId].setError(error)
		}
		await globalObj[userId].setLoading(false)
	}

	const fetchOlderTransactions = async () => {
		await fetchTransactions()
		await listener.restart()
	}

	onMounted(async () => {
		if (!globalObj[userId].fetched.value && !globalObj[userId].loading.value) await fetchTransactions()
		await listener.start()
	})
	onUnmounted(async () => {
		await listener.close()
	})

	const search = async () => {
		const searchValue = globalObj[userId].searchValue.value
		if (!searchValue) return
		globalObj[userId].searchMode.value = true
		await globalObj[userId].setError('')
		try {
			await globalObj[userId].setLoading(true)
			globalObj[userId].searchResults.value = await TransactionsUseCases.search(userId, searchValue)
		} catch (error) {
			await globalObj[userId].setError(error)
		}
		await globalObj[userId].setLoading(false)
	}

	watch(globalObj[userId].searchValue, () => {
		if (!globalObj[userId].searchValue.value) globalObj[userId].searchMode.value = false
	})

	return { ...globalObj[userId], fetchOlderTransactions, search }
}
