<template>
	<div
		class="fixed z-[10000] flex items-center justify-center h-full w-full top-0 left-0 bg-[#000] opacity-[0.35] text-4xl"
	>
		<SpinLoading />
	</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'PageLoading'
})
</script>
