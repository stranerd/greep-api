<template>
	<div class="card flex flex-col">
		<span v-if="transaction.isTrip" class="font-semibold">{{ transaction.data.customerName }}</span>
		<span v-if="transaction.isExpense" class="font-semibold">{{ transaction.data.name }}</span>
		<span class="font-light">{{ transaction.description }}</span>
		<nuxt-link
			:to="`/users/${transaction.driverId === id ? transaction.managerId : transaction.driverId}`"
			class="text-info"
		>
			see {{ transaction.driverId === id ? 'manager' : 'driver' }}
		</nuxt-link>
		<div class="flex items-center gap-1.5 text-secondaryText text-sm">
			<Icon :icon="transaction.isBalance ? 'CHECK_SQUARE' : transaction.isExpense ? 'DOLLAR' : 'CAR'" />
			<Icon v-if="transaction.isTrip" :icon="transaction.data.type === 'card' ? 'CREDIT_CARD' : 'MONEY_BILL'" />
			<span>
				{{ formatNumber(transaction.amount) }}
				<span v-if="transaction.isTrip">
					({{ transaction.data.paidAmount }} || {{ transaction.data.debt }})
				</span>
			</span>
			<span class="ml-auto">
				{{ formatTime(transaction.recordedAt) }} || {{ formatTime(transaction.createdAt) }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { TransactionEntity } from '@modules/users'
import { formatTime } from '@utils/dates'
import { formatNumber } from '@utils/commons'
import { useAuth } from '@app/hooks/auth/auth'

defineProps({
	transaction: {
		type: TransactionEntity,
		required: true
	}
})

const { id } = useAuth()
</script>
