<template>
	<form class="flex flex-col gap-6" @submit.prevent="resetPassword">
		<h1 class="md:text-3xl text-2xl w-full font-bold md:text-center">
			Forgot your password?
		</h1>

		<div class="flex flex-col">
			<label class="text-secondaryText mb-2">Email</label>
			<div class="flex gap-2 items-center">
				<input
					v-model.trim="factory.email"
					:class="{'valid': factory.isValid('email'), 'invalid': factory.errors.email}"
					class="w-full"
					placeholder="Enter your email"
					type="email"
					@keyup.enter="null"
				>
				<button v-if="sent" :disabled="!factory.isValid('email')" @click="sendResetEmail">
					<Icon :icon="sent ? 'REFRESH' : 'CHECK'" />
				</button>
			</div>
			<DisplayError :error="factory.errors.email" />
		</div>

		<template v-if="sent">
			<div class="flex flex-col">
				<label class="text-secondaryText mb-2">Password</label>
				<input
					v-model="factory.password"
					:class="{'valid': factory.isValid('password'), 'invalid': factory.errors.password}"
					placeholder="Enter new password"
					type="password"
				>
				<DisplayError :error="factory.errors.password" />
			</div>

			<div class="flex flex-col">
				<label class="text-secondaryText mb-2">Confirm Password</label>
				<input
					v-model="factory.cPassword"
					:class="{'valid': factory.isValid('cPassword'), 'invalid': factory.errors.cPassword}"
					placeholder="Confirm new password"
					type="password"
				>
				<DisplayError :error="factory.errors.cPassword" />
			</div>

			<div class="flex flex-col">
				<label class="text-secondaryText mb-2">OTP</label>
				<input v-model="factory.token" placeholder="Enter OTP sent to your email">
			</div>

			<button :disabled="loading || !factory.valid" type="submit">
				<SpinLoading v-if="loading" />
				<span v-else>Reset Password</span>
			</button>
		</template>

		<template v-else>
			<button :disabled="loading || !factory.isValid('email')" @click="sendResetEmail">
				<SpinLoading v-if="loading" />
				<span v-else>Send OTP to email</span>
			</button>
		</template>

		<nuxt-link class="mx-auto text-primaryBg text-sm" to="/auth/signin">
			Back to Sign in
		</nuxt-link>
	</form>
</template>

<script lang="ts" setup>
import { usePasswordReset } from '@app/hooks/auth/passwords'

definePageMeta({
	layout: 'auth',
	middleware: 'is-not-authenticated'
})

const {
	factory, loading, sent, sendResetEmail, resetPassword
} = usePasswordReset()

useHead({
	title: 'Forgot Password'
})
</script>
