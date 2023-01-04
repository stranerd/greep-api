<template>
	<div v-if="customers.length" class="card flex flex-col !gap-1 w-full">
		<h2 class="font-semibold">
			Customers
		</h2>
		<div v-for="customer in customers" :key="customer.hash" class="flex items-center gap-1">
			<span class="text-lg">{{ customer.name }}</span>
			(<span>{{ customer.trips }} trips</span>
			<span v-if="customer.debt">- {{ customer.debt }}</span>)
		</div>
	</div>
</template>

<script lang="ts" setup>
import { UserEntity } from '@modules/users'
import { useCustomersList } from '@app/hooks/users/customers'

const props = defineProps({
	user: {
		type: UserEntity,
		required: true
	}
})

const { customers } = useCustomersList(props.user.id)
</script>
