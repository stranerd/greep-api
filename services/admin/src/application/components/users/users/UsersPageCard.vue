<template>
	<div>
		<BlockLoading v-if="loading" />
		<div class="flex flex-col lg:flex-row gap-6 items-start">
			<div class="card flex items-center gap-4 w-full">
				<Avatar :id="user.id" :name="user.bio.name.full" :size="64" :src="user.bio.photo" />
				<div class="flex flex-col">
					<span class="text-lg">{{ user.bio.name.full }}</span>
					<span class="text-secondaryText">
						Joined {{ formatTime(user.dates.createdAt) }}
						<span v-if="user.dates.deletedAt"> - Deleted {{ formatTime(user.dates.deletedAt) }}</span>
					</span>
				</div>
				<div v-if="user.id !== id" class="ml-auto">
					<SpinLoading v-if="roleLoading" />
					<Icon v-else :icon="user.roles.isAdmin ? 'EYE' : 'EYE_SLASH'" @click="toggleAdmin(user)" />
				</div>
				<Icon v-else class="ml-auto" icon="SIGN_OUT" @click="signout" />
				<PageLoading v-if="signoutLoading" />
			</div>
			<div class="card flex flex-col !gap-6 w-full">
				<div class="flex flex-col gap-1">
					<h2 class="font-semibold">
						Manager
					</h2>
					<div v-if="manager" class="flex items-center gap-2">
						<Avatar :id="manager.id" :name="manager.bio.name.full" :src="manager.bio.photo" />
						<span class="text-lg">{{ manager.bio.name.full }}</span>
					</div>
					<span v-else>null</span>
				</div>
				<div class="flex flex-col gap-1">
					<h2 class="font-semibold">
						Drivers
					</h2>
					<span v-if="drivers.length === 0">No drivers</span>
					<div v-for="driver in drivers" :key="driver.hash" class="flex items-center gap-2">
						<Avatar :id="driver.id" :name="driver.bio.name.full" :src="driver.bio.photo" />
						<span class="text-lg">{{ driver.bio.name.full }}</span>
					</div>
				</div>
				<div v-if="managerRequests.length" class="flex flex-col gap-1">
					<h2 class="font-semibold">
						Manager Requests
					</h2>
					<div v-for="request in managerRequests" :key="request.hash" class="flex items-center gap-2">
						<Avatar :id="request.id" :name="request.bio.name.full" :src="request.bio.photo" />
						<span class="text-lg">{{ request.bio.name.full }}</span>
					</div>
				</div>
			</div>
			<CustomersList :user="user" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { UserEntity } from '@modules/users'
import { useUserManagerAndDrivers } from '@app/hooks/users'
import { formatTime } from '@utils/dates'
import { useAdminsList } from '@app/hooks/users/roles/admins'
import { useAuth } from '@app/hooks/auth/auth'
import { useSessionSignout } from '@app/hooks/auth/session'
import CustomersList from '@app/components/users/customers/CustomersList.vue'

const props = defineProps({
	user: {
		type: UserEntity,
		required: true
	}
})

const { id } = useAuth()
const { manager, drivers, managerRequests, loading } = useUserManagerAndDrivers(props.user)
const { toggleAdmin, loading: roleLoading } = useAdminsList()
const { signout, loading: signoutLoading } = useSessionSignout()
</script>
