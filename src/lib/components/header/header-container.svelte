<script lang="ts">
	import { fade } from 'svelte/transition';

	let { children, top = null } = $props();
</script>

<div
	style:top
	transition:fade|global={{ duration: 200 }}
	class={[
		'bg-background shadow-background top-safe-top pt-safe-top pointer-events-none right-0 left-0 z-50 shadow-md sm:fixed sm:pt-0'
	]}
>
	<div
		class="border-foreground/30 pointer-events-auto mx-auto flex h-16 w-full max-w-screen-sm items-center gap-2.5 px-5"
	>
		{@render children()}
	</div>
</div>
