<template>
	<div class="flex flex-col min-h-[100vh]">
		<LayoutsTopbar />
		<div class="w-full sm:w-8/12 lg:w-6/12 mx-auto p-4 h-fit flex-grow flex flex-col">
			<slot />
		</div>
	</div>
</template>
