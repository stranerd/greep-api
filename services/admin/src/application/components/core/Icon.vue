<template>
	<i :class="PrimeIcons[icon]" class="text-[1.3em]" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { PrimeIcons } from 'primevue/api'

defineProps({
	icon: {
		type: String as PropType<keyof typeof PrimeIcons>,
		required: true
	}
})
</script>
