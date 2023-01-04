<template>
	<div class="card-list">
		<div class="flex justify-between items-center gap-6">
			<h1 class="text-3xl">
				Users
			</h1>
			<p>{{ formatNumber(users.length) }} of {{ formatNumber(count) }} users fetched</p>
		</div>
		<form v-if="users.length" class="flex items-center gap-4" @submit.prevent="search">
			<input v-model.trim="searchValue" class="flex-1" placeholder="Search" type="search">
			<button type="submit">
				<Icon icon="SEARCH" />
			</button>
		</form>
		<UsersListCard v-for="user in (searchMode ? searchResults : users)" :key="user.hash" :user="user" />
		<BlockLoading v-if="loading" />
		<LoadMore v-if="hasMore && !searchMode" :load="fetchOlderUsers" />
	</div>
</template>

<script lang="ts" setup>
import { useUsersList } from '@app/hooks/users/list'
import { formatNumber } from '@utils/commons'

const {
	users,
	count,
	loading,
	hasMore,
	fetchOlderUsers,
	searchMode,
	searchValue,
	searchResults,
	search
} = useUsersList()
</script>
