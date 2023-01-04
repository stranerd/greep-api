<template>
	<div v-if="customers.length" class="card flex flex-col !gap-1 w-full">
		<h2 class="font-semibold">
			Customers
		</h2>
		<div v-for="customer in customers" :key="customer.hash" class="flex items-center gap-1">
			<span class="text-lg">{{ customer.name }}</span>
			<span>
				( {{ customer.trips }} {{ pluralize(customer.trips, 'trip', 'trips') }}
				{{ customer.debt ? ` | ${ customer.debt }` : '' }})
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { UserEntity } from '@modules/users'
import { useCustomersList } from '@app/hooks/users/customers'
import { pluralize } from '@utils/commons'

const props = defineProps({
	user: {
		type: UserEntity,
		required: true
	}
})

const { customers } = useCustomersList(props.user.id)
</script>
