<template>
	<div class="card-list">
		<div class="flex justify-between items-center gap-4">
			<h1 class="text-xl">
				Transactions
			</h1>
			<span v-if="!searchMode">
				{{ formatNumber(transactions.length) }} of {{ formatNumber(count) }} transactions
			</span>
		</div>
		<form v-if="transactions.length" class="flex items-center gap-4" @submit.prevent="search">
			<input v-model.trim="searchValue" class="flex-1" placeholder="Search for transactions" type="search">
			<button type="submit">
				<Icon icon="SEARCH" />
			</button>
		</form>
		<UsersTransactionsListCard
			v-for="transaction in (searchMode ? searchResults : transactions)"
			:key="transaction.hash"
			:transaction="transaction"
		/>
		<BlockLoading v-if="loading" />
		<LoadMore v-if="hasMore && !searchMode" :load="fetchOlderTransactions" />
	</div>
</template>

<script lang="ts" setup>
import { useTransactionsList } from '@app/hooks/users/transactions'
import { UserEntity } from '@modules/users'
import { formatNumber } from '@utils/commons'

const props = defineProps({
	user: {
		type: UserEntity,
		required: true
	}
})

const {
	transactions,
	loading,
	hasMore,
	count,
	fetchOlderTransactions,
	searchMode,
	searchValue,
	searchResults,
	search
} = useTransactionsList(props.user.id)
</script>
