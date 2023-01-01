<template>
	<div>
		<UsersList />
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: ['is-admin']
})

useHead({
	title: 'Users'
})
</script>
