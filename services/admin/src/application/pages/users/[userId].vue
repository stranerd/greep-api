<template>
	<BlockLoading v-if="loading" />
	<UsersPageCard v-else-if="user" :key="user.hash" :user="user" />
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
