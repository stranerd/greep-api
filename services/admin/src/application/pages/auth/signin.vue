<template>
	<form class="flex flex-col gap-6" @submit.prevent="signin">
		<h1 class="md:text-3xl text-2xl w-full font-bold md:text-center">
			Sign in
		</h1>

		<AuthProviders />

		<div class="flex flex-col w-full">
			<label class="text-secondaryText mb-2">Email</label>
			<input
				v-model.trim="factory.email"
				:class="{'valid': factory.isValid('email'), 'invalid': factory.errors.email}"
				placeholder="Enter your email"
				type="email"
			>
			<DisplayError :error="factory.errors.email" />
		</div>

		<div class="flex flex-col">
			<label class="text-secondaryText mb-2">Password</label>
			<input
				v-model="factory.password"
				:class="{'valid': factory.isValid('password'), 'invalid': factory.errors.password}"
				placeholder="Enter your password"
				type="password"
			>
			<DisplayError :error="factory.errors.password" />
		</div>

		<nuxt-link class="mx-auto text-primaryBg text-sm" to="/auth/forgot">
			Forgot your password?
		</nuxt-link>

		<button :disabled="loading || !factory.valid" type="submit">
			<SpinLoading v-if="loading" />
			<span v-else>Sign in</span>
		</button>

		<span class="flex justify-center items-center text-secondaryText text-sm">
			Don’t have an account?
			<nuxt-link class="text-primaryBg ml-1" to="/auth/signup">
				Create account
			</nuxt-link>
		</span>
	</form>
</template>

<script lang="ts" setup>
import { useEmailSignin } from '@app/hooks/auth/signin'

definePageMeta({
	layout: 'auth',
	middleware: 'is-not-authenticated'
})

const { factory, loading, signin } = useEmailSignin()

useHead({
	title: 'Signin'
})
</script>
