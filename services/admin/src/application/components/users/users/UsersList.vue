<template>
	<div class="card-list">
		<div class="flex justify-between items-center gap-6">
			<h1 class="text-3xl">
				Users
			</h1>
			<p>{{ formatNumber(users.length) }} of {{ formatNumber(count) }} users fetched</p>
		</div>
		<UsersListCard v-for="user in users" :key="user.hash" :user="user" />
		<BlockLoading v-if="loading" />
		<LoadMore v-if="hasMore" :load="fetchOlderUsers" />
	</div>
</template>

<script lang="ts" setup>
import { useUsersList } from '@app/hooks/users/list'
import { formatNumber } from '@utils/commons'

const { users, count, loading, hasMore, fetchOlderUsers } = useUsersList()
</script>
