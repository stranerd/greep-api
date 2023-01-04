<template>
	<BlockLoading v-if="loading" />
	<div v-else-if="user" class="flex flex-col gap-6">
		<UsersPageCard :key="user.hash" :user="user" />
		<UsersCustomersList :user="user" />
		<UsersTransactionsList :user="user" class="card" />
	</div>
	<NotFound v-else title="User not found" />
</template>

<script lang="ts" setup>
import { useUser } from '@app/hooks/users'

const route = useRoute()
const userId = route.params.userId as string
const { user, loading } = useUser(userId)

useHead({
	title: computed(() => user.value?.bio.name.full ?? 'User not found')
})
</script>
