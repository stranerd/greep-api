<template>
	<form class="flex flex-col gap-6" @submit.prevent="signup">
		<h1 class="md:text-3xl text-2xl w-full font-bold md:text-center">
			Sign up
		</h1>

		<AuthProviders />

		<div class="flex w-full gap-4">
			<div class="flex flex-col w-1/2">
				<label class="text-secondaryText mb-2">First Name</label>
				<input
					v-model="factory.firstName"
					:class="{'valid': factory.isValid('firstName'), 'invalid': factory.errors.firstName}"
					class="flex-grow-0"
					placeholder="Enter your first name"
				>
				<DisplayError :error="factory.errors.firstName" />
			</div>
			<div class="flex flex-col w-1/2">
				<label class="text-secondaryText mb-2">Last Name</label>
				<input
					v-model="factory.lastName"
					:class="{'valid': factory.isValid('lastName'), 'invalid': factory.errors.lastName}"
					class="flex-grow-0"
					placeholder="Enter your last name"
				>
				<DisplayError :error="factory.errors.lastName" />
			</div>
		</div>

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

		<div class="flex flex-col">
			<label class="text-secondaryText mb-2">Confirm Password</label>
			<input
				v-model="factory.cPassword"
				:class="{'valid': factory.isValid('cPassword'), 'invalid': factory.errors.cPassword}"
				placeholder="Confirm your password"
				type="password"
			>
			<DisplayError :error="factory.errors.cPassword" />
		</div>

		<button :disabled="loading || !factory.valid" type="submit">
			<SpinLoading v-if="loading" />
			<span v-else>Sign up</span>
		</button>

		<span class="w-full flex justify-center items-center text-secondaryText text-sm">
			Have an account?
			<nuxt-link class="text-primaryBg ml-1" to="/auth/signin">
				Sign in
			</nuxt-link>
		</span>
	</form>
</template>

<script lang="ts" setup>
import { useEmailSignup } from '@app/hooks/auth/signin'

definePageMeta({
	layout: 'auth',
	middleware: 'is-not-authenticated'
})

const { factory, loading, signup } = useEmailSignup()

useHead({
	title: 'Signup'
})
</script>
