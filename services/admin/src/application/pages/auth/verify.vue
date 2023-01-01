<template>
	<form class="flex flex-col gap-6" @submit.prevent="completeVerification">
		<h1 class="md:text-3xl text-2xl w-full font-bold md:text-center">
			Verify Your Account
		</h1>

		<div class="flex flex-col">
			<label class="text-secondaryText mb-2">OTP</label>
			<input v-model="token" placeholder="Enter OTP sent to your email">
		</div>

		<p
			class="cursor-pointer justify-center flex items-center text-primaryBg text-sm gap-2"
			@click="sendVerificationEmail"
		>
			<SpinLoading v-if="loading" />
			<span>Did not receive OTP? Resend?</span>
		</p>

		<button :disabled="loading || !token" type="submit">
			<SpinLoading v-if="loading" />
			<span v-else>Complete Verification</span>
		</button>

		<nuxt-link class="mx-auto text-primaryBg text-sm" to="/auth/signin">
			Back to Sign in
		</nuxt-link>
	</form>
</template>

<script lang="ts" setup>
import { getEmailVerificationEmail, useEmailVerification } from '@app/hooks/auth/signin'

definePageMeta({
	layout: 'auth',
	middleware: async () => {
		if (!getEmailVerificationEmail()) return navigateTo('/auth/signin')
	}
})

const {
	token, loading, completeVerification, sendVerificationEmail
} = useEmailVerification()

useHead({
	title: 'Verify Email'
})
</script>
