<script lang="ts">
	import { fade } from 'svelte/transition';

	let { children, top = null } = $props();
</script>

<div
	style:top
	transition:fade|global={{ duration: 200 }}
	class={[
		'pt-safe-top to-background via-background pointer-events-none fixed top-0 right-0 left-0 z-50 bg-gradient-to-t via-30% pb-5'
	]}
>
	<div
		class=" border-foreground/30 pointer-events-auto mx-auto flex h-16 w-full max-w-screen-sm items-center gap-2.5 px-5"
	>
		{@render children()}
	</div>
</div>
