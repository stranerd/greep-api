<template>
	<div class="flex justify-between py-4 px-8 gap-6 items-center shadow-xl">
		<nuxt-link to="/">
			<img alt="Greep" class="w-[40px]" src="@app/assets/images/logo.svg">
		</nuxt-link>
		<div v-if="user" class="flex gap-2 items-center">
			<span>Hi, {{ user.bio.name.full }}</span>
			<Avatar :id="user.id" :name="user.bio.name.full" :size="32" :src="user.bio.photo" />
		</div>
		<nuxt-link v-else to="/auth/signin">
			Sign in
		</nuxt-link>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/hooks/auth/auth'

const { user } = useAuth()
</script>
