<template>
	<nuxt-link :to="`/users/${user.id}`" class="card flex flex-col">
		<div class="flex items-center gap-2">
			<Avatar :id="user.id" :name="user.bio.name.full" :src="user.bio.photo" />
			<span class="truncate">{{ user.bio.name.full }}</span>
			<span class="ml-auto">Joined {{ formatTime(user.dates.createdAt) }}</span>
		</div>
		<div class="flex gap-6 items-center">
			<Icon v-if="user.roles.isAdmin" icon="EYE" />
			<span v-if="user.manager" class="flex gap-1 items-center">
				<Icon icon="BOOK" />
				<span>{{ formatNumber(user.manager.commission * 100) }}%</span>
			</span>
			<span v-if="user.drivers.length" class="flex gap-1 items-center">
				<Icon icon="CAR" />
				<span>x{{ formatNumber(user.drivers.length) }}</span>
			</span>
			<span v-if="user.managerRequests.length" class="flex gap-1 items-center">
				<Icon icon="USER_PLUS" />
				<span>x{{ formatNumber(user.managerRequests.length) }}</span>
			</span>
			<span v-if="user.dates.deletedAt" class="ml-auto">Deleted {{ formatTime(user.dates.deletedAt) }}</span>
		</div>
	</nuxt-link>
</template>

<script lang="ts" setup>
import { UserEntity } from '@modules/users'
import { formatTime } from '@utils/dates'
import { formatNumber } from '@utils/commons'

defineProps({
	user: {
		type: UserEntity,
		required: true
	}
})
</script>
