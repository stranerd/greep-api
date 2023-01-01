<template>
	<GoogleLogin :callback="(res) => googleSignin(res.credential)" :client-id="googleClientId" />
	<PageLoading v-if="googleLoading" />
</template>

<script lang="ts" setup>
import { GoogleLogin } from 'vue3-google-login'
import { useGoogleSignin } from '@app/hooks/auth/signin'
import { googleClientId } from '@utils/environment'

const { signin: googleSignin, loading: googleLoading } = useGoogleSignin()
</script>
